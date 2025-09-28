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

  // Mobile menu init
  if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
    mobileMenu.classList.add('hidden');
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
  menuBtn.addEventListener('click', () => {
    const isHidden = mobileMenu.classList.toggle('hidden');
    menuBtn.setAttribute('aria-expanded', String(!isHidden));
  });
  // Close mobile menu with Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

// Mobile menu slide-down logic
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    if (mobileMenu.classList.contains('open')) {
      mobileMenu.style.display = 'block';
      setTimeout(() => mobileMenu.style.maxHeight = '400px', 10);
    } else {
      mobileMenu.style.maxHeight = '0';
      setTimeout(() => mobileMenu.style.display = 'none', 350);
    }
  });
  // Close menu on nav link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      mobileMenu.style.maxHeight = '0';
      setTimeout(() => mobileMenu.style.display = 'none', 350);
    });
  });
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
      mobileMenu.classList.remove('open');
      mobileMenu.style.maxHeight = '0';
      setTimeout(() => mobileMenu.style.display = 'none', 350);
    }
  });
}

// Cart drawer open/close
if (cartBtn && cartDrawer && cartClose) {
  // open/close handlers for cart drawer
  cartBtn.addEventListener('click', () => {
    cartDrawer.classList.remove('translate-x-full');
    cartDrawer.classList.add('translate-x-0');
  });
  cartClose.addEventListener('click', () => {
    cartDrawer.classList.add('translate-x-full');
    cartDrawer.classList.remove('translate-x-0');
  });
  // close drawer with Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartDrawer && !cartDrawer.classList.contains('translate-x-full')) {
      cartDrawer.classList.add('translate-x-full');
    }
  });
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

function persistCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartUI() {
  // count
  const count = cart.reduce((sum, p) => sum + p.qty, 0);
  if (cartCountEl) cartCountEl.textContent = String(count);

  // total
  const total = cart.reduce((sum, p) => sum + p.qty * p.price, 0);
  if (cartTotalEl) cartTotalEl.textContent = `$${total.toFixed(2)}`;

  // items list
  if (!cartItemsEl) return;
  cartItemsEl.innerHTML = "";
  cart.forEach((p) => {
    const row = document.createElement("div");
    row.className = "flex items-center gap-3";
    row.innerHTML = `
      <img src="${p.image}" alt="${p.title}" class="w-14 h-14 object-cover rounded"/>
      <div class="flex-1">
        <div class="text-sm font-medium">${p.title}</div>
        <div class="text-xs text-gray-600 dark:text-gray-300">$${p.price.toFixed(2)}</div>
      </div>
      <div class="flex items-center gap-2">
        <button class="qty-dec px-2 py-1 rounded bg-gray-200 dark:bg-gray-700">-</button>
        <span class="w-6 text-center">${p.qty}</span>
        <button class="qty-inc px-2 py-1 rounded bg-gray-200 dark:bg-gray-700">+</button>
        <button class="remove px-2 py-1 rounded bg-rose-600 text-white">x</button>
      </div>
    `;
    // attach handlers
    row.querySelector(".qty-inc").addEventListener("click", () => changeQty(p.title, 1));
    row.querySelector(".qty-dec").addEventListener("click", () => changeQty(p.title, -1));
    row.querySelector(".remove").addEventListener("click", () => removeFromCart(p.title));
    cartItemsEl.appendChild(row);
  });
}
