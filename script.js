// Get elements
const loginBtn = document.getElementById("login");
const loginPage = document.querySelector(".loginPage");
const logedBtn = document.getElementById("loged");
const cartBtn = document.getElementById("cart-btn");
const cartClose = document.getElementById("cart-close");
const cartDrawer = document.getElementById("cart-drawer");
const cartItemsEl = document.getElementById("cart-items");
const cartCountEl = document.getElementById("cart-count");
const cartTotalEl = document.getElementById("cart-total");
let cart = [];
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

// Centralized login toggle: handles login panel and logout
if (loginBtn) {
  const toggleLoginPanel = () => {
    const panel = document.getElementById('login-panel');
    // If user is logged in (button shows Logout), treat click as logout
    if ((loginBtn.textContent || '').trim() === 'Logout') {
      localStorage.removeItem('loggedIn');
      loginBtn.textContent = 'Log In';
      if (panel) panel.classList.add('hidden');
      loginBtn.setAttribute('aria-expanded', 'false');
      alert('Logged out successfully.');
      return;
    }

    if (!panel) return;
    const isHidden = panel.classList.toggle('hidden');
    panel.setAttribute('aria-hidden', String(isHidden));
    loginBtn.setAttribute('aria-expanded', String(!isHidden));
    if (!isHidden) panel.querySelector('input')?.focus();
  };

  loginBtn.addEventListener('click', toggleLoginPanel);
}

// Handle login
logedBtn.addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("pass").value;

  if (email && pass) {
    localStorage.setItem("loggedIn", "true");
    if (!loginPage.classList.contains('hidden')) loginPage.classList.add('hidden');
    loginPage.setAttribute('aria-hidden', 'true');
    loginBtn.textContent = "Logout";
    alert("Login successful!");
  } else {
    alert("Please fill in both fields.");
  }
});

// Auto set login state on page load
window.onload = () => {
  if (localStorage.getItem("loggedIn") === "true") {
    loginBtn.textContent = "Logout";
  } else {
    loginBtn.textContent = "Log In";
  }
  // Hide login box on load
  if (!loginPage.classList.contains('hidden')) loginPage.classList.add('hidden');
  // Initialize theme toggle button label
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    const isDark = document.documentElement.classList.contains("dark");
    themeToggle.textContent = isDark ? "Light" : "Dark";
  }

  // Initialize cart from storage
  try {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (Array.isArray(savedCart)) {
      cart = savedCart;
    }
  } catch (_) {
    cart = [];
  }
  updateCartUI();
  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile menu init - ensure it starts hidden
  if (mobileMenu) {
    mobileMenu.classList.add('hidden');
    mobileMenu.style.display = 'none';
    mobileMenu.style.maxHeight = '0';
    mobileMenu.style.opacity = '0';
  }
  // ensure login button aria state is initialized
  if (loginBtn) loginBtn.setAttribute('aria-expanded', 'false');
};



// Theme toggle with persistence
const themeToggleBtn = document.getElementById("theme-toggle");
if (themeToggleBtn) {
  // initialize label and aria correctly
  const initThemeButton = () => {
    const root = document.documentElement;
    const isDark = root.classList.contains('dark');
    themeToggleBtn.textContent = isDark ? 'Light' : 'Dark';
    themeToggleBtn.setAttribute('aria-pressed', String(isDark));
  };

  // ensure stored preference is applied (in case script ran before inline init)
  const stored = localStorage.getItem('theme');
  if (stored === 'dark') document.documentElement.classList.add('dark');
  else if (stored === 'light') document.documentElement.classList.remove('dark');

  initThemeButton();

  themeToggleBtn.addEventListener("click", () => {
    const root = document.documentElement; // toggle on <html>
    const isDark = root.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    initThemeButton();
  });
}

// Hamburger menu toggle (with ARIA)
if (menuBtn && mobileMenu) {
  menuBtn.setAttribute('aria-expanded', 'false');
  
  const toggleMobileMenu = () => {
    const isHidden = mobileMenu.classList.toggle('hidden');
    menuBtn.setAttribute('aria-expanded', String(!isHidden));
    
    // Add smooth transition
    if (!isHidden) {
      mobileMenu.style.display = 'block';
      setTimeout(() => {
        mobileMenu.style.opacity = '1';
        mobileMenu.style.maxHeight = '400px';
      }, 10);
    } else {
      mobileMenu.style.opacity = '0';
      mobileMenu.style.maxHeight = '0';
      setTimeout(() => {
        mobileMenu.style.display = 'none';
      }, 300);
    }
  };
  
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMobileMenu();
  });
  
  // Close mobile menu with Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
      toggleMobileMenu();
    }
  });
  
  // Close menu on nav link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggleMobileMenu();
    });
  });
  
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target) && !mobileMenu.classList.contains('hidden')) {
      toggleMobileMenu();
    }
  });
}

// Cart drawer open/close with overlay
const cartOverlay = document.getElementById('cart-overlay');
const checkoutBtn = document.getElementById('checkout-btn');
const continueShoppingBtn = document.getElementById('continue-shopping');

const openCart = () => {
  if (cartDrawer && cartOverlay) {
    cartDrawer.classList.remove('translate-x-full');
    cartDrawer.classList.add('translate-x-0');
    cartOverlay.classList.remove('opacity-0', 'pointer-events-none');
    cartOverlay.classList.add('opacity-100');
    document.body.style.overflow = 'hidden'; // Prevent body scroll
  }
};

const closeCart = () => {
  if (cartDrawer && cartOverlay) {
    cartDrawer.classList.add('translate-x-full');
    cartDrawer.classList.remove('translate-x-0');
    cartOverlay.classList.add('opacity-0', 'pointer-events-none');
    cartOverlay.classList.remove('opacity-100');
    document.body.style.overflow = ''; // Restore body scroll
  }
};

if (cartBtn && cartDrawer && cartClose) {
  // Open cart
  cartBtn.addEventListener('click', openCart);
  
  // Close cart
  cartClose.addEventListener('click', closeCart);
  
  // Close on overlay click
  if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCart);
  }
  
  // Prevent cart drawer from closing when clicking inside it
  if (cartDrawer) {
    cartDrawer.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
  
  // Close drawer with Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartDrawer && !cartDrawer.classList.contains('translate-x-full')) {
      closeCart();
    }
  });
  
  // Continue shopping button
  if (continueShoppingBtn) {
    continueShoppingBtn.addEventListener('click', closeCart);
  }
  
  // Checkout button
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
      }
      // Redirect to checkout page
      window.location.href = 'checkout.html';
    });
  }
}

// Add to cart buttons (fix: always use up-to-date DOM and event delegation)
document.addEventListener('click', function(e) {
  if (e.target && (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart'))) {
    const btn = e.target.closest('.add-to-cart');
    const title = btn.getAttribute('data-title') || 'Item';
    const price = parseFloat(btn.getAttribute('data-price') || '0');
    const image = btn.getAttribute('data-image') || '';
    addToCart({ title, price, image });
  }
});

function addToCart(item) {
  const index = cart.findIndex((p) => p.title === item.title);
  if (index > -1) {
    cart[index].qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  persistCart();
  updateCartUI();
  // Open cart drawer when item is added
  openCart();
}

function removeFromCart(title) {
  const index = cart.findIndex((p) => p.title === title);
  if (index > -1) {
    cart.splice(index, 1);
  }
  persistCart();
  updateCartUI();
}

function changeQty(title, delta) {
  const index = cart.findIndex((p) => p.title === title);
  if (index > -1) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }
  }
  persistCart();
  updateCartUI();
}

// Update all product card "Add to Cart" buttons to show current cart quantities
function updateProductCardButtons() {
  // Wait for DOM to be ready if called early
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateProductCardButtons);
    return;
  }

  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  
  addToCartButtons.forEach(button => {
    const title = button.getAttribute('data-title');
    if (!title) return;

    // Find item in cart
    const cartItem = cart.find(item => item.title === title);
    const quantity = cartItem ? cartItem.qty : 0;

    // Update button text and styling with smooth transition
    const wasAdded = button.classList.contains('quantity-updated');
    const currentQty = button.getAttribute('data-quantity');
    
    if (quantity > 0) {
      // Change to "Added (X)" with green styling
      button.innerHTML = `<span class="flex items-center justify-center gap-2">
        <i class="fa-solid fa-check"></i>
        Added (${quantity})
      </span>`;
      
      // Update classes with transition
      button.classList.remove('bg-blue-600', 'hover:bg-blue-700');
      button.classList.add('bg-green-600', 'hover:bg-green-700');
      button.setAttribute('data-quantity', quantity);
      
      // Add pulse animation when quantity changes or on first add
      if (!wasAdded || currentQty !== String(quantity)) {
        button.classList.add('quantity-updated');
        button.classList.add('animate-pulse');
        setTimeout(() => {
          button.classList.remove('animate-pulse');
        }, 600);
      }
    } else {
      // Reset to "Add to Cart" with blue styling
      button.innerHTML = 'Add to Cart';
      button.classList.remove('bg-green-600', 'hover:bg-green-700', 'quantity-updated');
      button.classList.add('bg-blue-600', 'hover:bg-blue-700');
      button.removeAttribute('data-quantity');
    }
  });
}

function persistCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartUI() {
  // count
  const count = cart.reduce((sum, p) => sum + p.qty, 0);
  if (cartCountEl) cartCountEl.textContent = String(count);

  // total
  const total = cart.reduce((sum, p) => sum + p.qty * p.price, 0);
  const subtotal = total; // Subtotal and total are same (no taxes/shipping shown separately)
  
  if (cartTotalEl) cartTotalEl.textContent = `$${total.toFixed(2)}`;
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  if (cartSubtotalEl) cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;

  // Enable/disable checkout button
  if (checkoutBtn) {
    checkoutBtn.disabled = cart.length === 0;
  }

  // Update all product card buttons to show cart quantities
  updateProductCardButtons();

  // items list
  if (!cartItemsEl) return;
  cartItemsEl.innerHTML = "";
  
  // Empty cart state
  if (cart.length === 0) {
    cartItemsEl.innerHTML = `
      <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div class="w-24 h-24 mb-4 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
          <i class="fa-solid fa-cart-shopping text-4xl text-gray-400 dark:text-slate-500"></i>
        </div>
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2 font-poppins">Your cart is empty</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">Add some products to get started!</p>
        <button id="empty-cart-shop" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          Start Shopping
        </button>
      </div>
    `;
    const emptyCartShopBtn = document.getElementById('empty-cart-shop');
    if (emptyCartShopBtn) {
      emptyCartShopBtn.addEventListener('click', () => {
        closeCart();
        window.location.href = '#home';
      });
    }
    return;
  }

  // Render cart items
  cart.forEach((p) => {
    const itemTotal = (p.qty * p.price).toFixed(2);
    const cartItem = document.createElement("div");
    cartItem.className = "bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow";
    cartItem.innerHTML = `
      <div class="flex gap-4">
        <!-- Product Image -->
        <div class="flex-shrink-0">
          <img 
            src="${p.image}" 
            alt="${p.title}" 
            class="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-gray-200 dark:border-slate-600"
            onerror="this.src='https://via.placeholder.com/100?text=No+Image'"
          />
        </div>
        
        <!-- Product Details -->
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2 mb-2">
            <h3 class="text-sm sm:text-base font-semibold text-slate-900 dark:text-white font-poppins line-clamp-2">${p.title}</h3>
            <button 
              class="remove flex-shrink-0 p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              aria-label="Remove ${p.title}"
            >
              <i class="fa-solid fa-trash text-xs"></i>
            </button>
          </div>
          
          <!-- Price per unit -->
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
            <span class="font-medium">$${p.price.toFixed(2)}</span> each
          </p>
          
          <!-- Quantity Controls -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 border border-gray-300 dark:border-slate-600 rounded-lg">
              <button 
                class="qty-dec px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-l-lg transition-colors font-medium"
                aria-label="Decrease quantity"
              >
                <i class="fa-solid fa-minus text-xs"></i>
              </button>
              <span class="qty-display w-8 text-center text-sm font-semibold text-slate-900 dark:text-white">${p.qty}</span>
              <button 
                class="qty-inc px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-r-lg transition-colors font-medium"
                aria-label="Increase quantity"
              >
                <i class="fa-solid fa-plus text-xs"></i>
              </button>
            </div>
            
            <!-- Item Total -->
            <div class="text-right">
              <p class="text-xs text-gray-500 dark:text-gray-400">Total</p>
              <p class="text-base font-bold text-blue-600 dark:text-blue-400 font-poppins">$${itemTotal}</p>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Attach event handlers
    const qtyInc = cartItem.querySelector(".qty-inc");
    const qtyDec = cartItem.querySelector(".qty-dec");
    const removeBtn = cartItem.querySelector(".remove");
    
    if (qtyInc) {
      qtyInc.addEventListener("click", (e) => {
        e.stopPropagation();
        changeQty(p.title, 1);
      });
    }
    
    if (qtyDec) {
      qtyDec.addEventListener("click", (e) => {
        e.stopPropagation();
        changeQty(p.title, -1);
      });
    }
    
    if (removeBtn) {
      removeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (confirm(`Remove "${p.title}" from cart?`)) {
          removeFromCart(p.title);
        }
      });
    }
    
    cartItemsEl.appendChild(cartItem);
  });
}

// Search Functionality - Initialize after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initializeSearch();
});

function initializeSearch() {
  const searchInput = document.getElementById('q');
  const searchClearBtn = document.getElementById('search-clear');
  const searchNoResults = document.getElementById('search-no-results');
  const productSections = document.querySelectorAll('.product-section');

  // Initialize search functionality
  if (searchInput) {
    // Get all product cards
    const getAllProductCards = () => {
      return document.querySelectorAll('.product-card[data-product-name]');
    };

    // Filter products based on search query
    const filterProducts = (query) => {
      const searchQuery = query.trim().toLowerCase();
      const productCards = getAllProductCards();
      let hasResults = false;
      let visibleSections = new Set();

      if (searchQuery === '') {
        // Show all products and sections
        productCards.forEach(card => {
          card.style.display = '';
          card.classList.remove('hidden');
        });
        productSections.forEach(section => {
          section.style.display = '';
        });
        if (searchNoResults) searchNoResults.classList.add('hidden');
        return;
      }

      // Filter products
      productCards.forEach(card => {
        const productName = (card.getAttribute('data-product-name') || '').toLowerCase();
        const productCategory = (card.getAttribute('data-product-category') || '').toLowerCase();
        
        const matchesName = productName.includes(searchQuery);
        const matchesCategory = productCategory.includes(searchQuery);
        
        if (matchesName || matchesCategory) {
          card.style.display = '';
          card.classList.remove('hidden');
          hasResults = true;
          
          // Track which section this product belongs to
          const section = card.closest('.product-section');
          if (section) {
            visibleSections.add(section);
          }
        } else {
          card.style.display = 'none';
          card.classList.add('hidden');
        }
      });

      // Show/hide sections based on visible products
      productSections.forEach(section => {
        const hasVisibleProducts = Array.from(section.querySelectorAll('.product-card')).some(
          card => !card.classList.contains('hidden') && card.style.display !== 'none'
        );
        
        if (hasVisibleProducts) {
          section.style.display = '';
        } else {
          section.style.display = 'none';
        }
      });

      // Show/hide "no results" message
      if (searchNoResults) {
        if (hasResults) {
          searchNoResults.classList.add('hidden');
        } else {
          searchNoResults.classList.remove('hidden');
          // Scroll to no results message
          searchNoResults.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    };

    // Handle search input
    const handleSearch = () => {
      const query = searchInput.value;
      filterProducts(query);
      
      // Show/hide clear button
      if (searchClearBtn) {
        if (query.trim() !== '') {
          searchClearBtn.classList.remove('hidden');
        } else {
          searchClearBtn.classList.add('hidden');
        }
      }
    };

    // Event listeners
    searchInput.addEventListener('input', handleSearch);
    searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    });

    // Clear search
    if (searchClearBtn) {
      searchClearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchInput.focus();
        handleSearch();
      });
    }

    // Search button handlers
    const searchBtn = document.getElementById('search-btn');
    const searchBtnMobile = document.getElementById('search-btn-mobile');
    
    if (searchBtn) {
      searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleSearch();
        // Scroll to first result
        const firstVisible = document.querySelector('.product-card:not(.hidden)');
        if (firstVisible) {
          firstVisible.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (searchNoResults && !searchNoResults.classList.contains('hidden')) {
          searchNoResults.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    }

    if (searchBtnMobile) {
      searchBtnMobile.addEventListener('click', (e) => {
        e.preventDefault();
        handleSearch();
        // Scroll to first result
        const firstVisible = document.querySelector('.product-card:not(.hidden)');
        if (firstVisible) {
          firstVisible.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (searchNoResults && !searchNoResults.classList.contains('hidden')) {
          searchNoResults.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    }

    // Clear search on Escape key
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        handleSearch();
        searchInput.blur();
      }
    });
  }
}

