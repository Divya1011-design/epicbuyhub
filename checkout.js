// Checkout Page JavaScript

// Load cart from localStorage
let cart = [];
try {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (Array.isArray(savedCart)) {
        cart = savedCart;
    }
} catch (_) {
    cart = [];
}

// Initialize checkout page
document.addEventListener('DOMContentLoaded', () => {
    // Set footer year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    // Check if cart is empty
    if (cart.length === 0) {
        alert('Your cart is empty! Redirecting to home page...');
        window.location.href = 'index.html';
        return;
    }

    // Render cart items
    renderCheckoutItems();
    updateCheckoutTotals();

    // Handle form submission
    const checkoutForm = document.getElementById('checkout-form');
    const placeOrderBtn = document.getElementById('place-order-btn');

    if (checkoutForm && placeOrderBtn) {
        checkoutForm.addEventListener('submit', handlePlaceOrder);
    }
});

function renderCheckoutItems() {
    const checkoutItemsEl = document.getElementById('checkout-items');
    if (!checkoutItemsEl) return;

    checkoutItemsEl.innerHTML = '';

    cart.forEach((item) => {
        const itemTotal = (item.qty * item.price).toFixed(2);
        const itemEl = document.createElement('div');
        itemEl.className = 'flex gap-4 pb-4 border-b border-gray-200 dark:border-slate-700 last:border-0';
        itemEl.innerHTML = `
            <div class="flex-shrink-0">
                <img 
                    src="${item.image}" 
                    alt="${item.title}" 
                    class="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-slate-600"
                    onerror="this.src='https://via.placeholder.com/100?text=No+Image'"
                />
            </div>
            <div class="flex-1 min-w-0">
                <h3 class="text-sm font-semibold text-slate-900 dark:text-white font-poppins mb-1 line-clamp-2">${item.title}</h3>
                <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    <span class="font-medium">$${item.price.toFixed(2)}</span> × <span>${item.qty}</span>
                </p>
                <p class="text-sm font-bold text-blue-600 dark:text-blue-400 font-poppins">$${itemTotal}</p>
            </div>
        `;
        checkoutItemsEl.appendChild(itemEl);
    });
}

function updateCheckoutTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.qty * item.price), 0);
    const shipping = 5.99;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    const subtotalEl = document.getElementById('checkout-subtotal');
    const taxEl = document.getElementById('checkout-tax');
    const totalEl = document.getElementById('checkout-total');

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

function handlePlaceOrder(e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(e.target);
    const orderData = {
        customer: {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            city: formData.get('city'),
            state: formData.get('state'),
            zipCode: formData.get('zipCode'),
        },
        paymentMethod: formData.get('paymentMethod'),
        items: cart.map(item => ({
            title: item.title,
            price: item.price,
            quantity: item.qty,
            image: item.image
        })),
        totals: {
            subtotal: cart.reduce((sum, item) => sum + (item.qty * item.price), 0),
            shipping: 5.99,
            tax: cart.reduce((sum, item) => sum + (item.qty * item.price), 0) * 0.08,
        }
    };

    // Calculate total
    orderData.totals.total = orderData.totals.subtotal + orderData.totals.shipping + orderData.totals.tax;

    // Generate order ID
    const orderId = 'ORD-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    orderData.orderId = orderId;

    // Save order to localStorage (for success page)
    localStorage.setItem('lastOrder', JSON.stringify(orderData));

    // Clear cart
    localStorage.removeItem('cart');

    // Redirect to success page
    window.location.href = 'success.html';
}

