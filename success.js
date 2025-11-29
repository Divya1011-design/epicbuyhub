// Success Page JavaScript

let orderData = null;

// Initialize success page
document.addEventListener('DOMContentLoaded', () => {
    // Set footer year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    // Load order data from localStorage
    try {
        const savedOrder = localStorage.getItem('lastOrder');
        if (!savedOrder) {
            // No order data found, redirect to home
            alert('No order found. Redirecting to home page...');
            window.location.href = 'index.html';
            return;
        }
        orderData = JSON.parse(savedOrder);
    } catch (error) {
        console.error('Error loading order data:', error);
        alert('Error loading order information. Redirecting to home page...');
        window.location.href = 'index.html';
        return;
    }

    // Render order information
    renderOrderInfo();
    renderOrderItems();
    renderShippingAddress();
    renderPaymentMethod();
    renderOrderTotals();
    setDeliveryDate();

    // Handle print order button
    const printBtn = document.getElementById('print-order');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }
});

function renderOrderInfo() {
    if (!orderData) return;

    const orderIdEl = document.getElementById('order-id');
    const orderEmailEl = document.getElementById('order-email');

    if (orderIdEl && orderData.orderId) {
        orderIdEl.textContent = orderData.orderId;
    }

    if (orderEmailEl && orderData.customer && orderData.customer.email) {
        orderEmailEl.textContent = orderData.customer.email;
    }
}

function renderOrderItems() {
    const orderItemsEl = document.getElementById('order-items');
    if (!orderItemsEl || !orderData || !orderData.items) return;

    orderItemsEl.innerHTML = '';

    orderData.items.forEach((item) => {
        const itemTotal = (item.quantity * item.price).toFixed(2);
        const itemEl = document.createElement('div');
        itemEl.className = 'flex gap-4 pb-4 border-b border-gray-200 dark:border-slate-700 last:border-0';
        itemEl.innerHTML = `
            <div class="flex-shrink-0">
                <img 
                    src="${item.image}" 
                    alt="${item.title}" 
                    class="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-gray-200 dark:border-slate-600"
                    onerror="this.src='https://via.placeholder.com/100?text=No+Image'"
                />
            </div>
            <div class="flex-1 min-w-0">
                <h3 class="text-base font-semibold text-slate-900 dark:text-white font-poppins mb-2">${item.title}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span class="font-medium">$${item.price.toFixed(2)}</span> × <span>${item.quantity}</span>
                </p>
                <p class="text-lg font-bold text-blue-600 dark:text-blue-400 font-poppins">$${itemTotal}</p>
            </div>
        `;
        orderItemsEl.appendChild(itemEl);
    });
}

function renderShippingAddress() {
    const shippingAddressEl = document.getElementById('shipping-address');
    if (!shippingAddressEl || !orderData || !orderData.customer) return;

    const customer = orderData.customer;
    shippingAddressEl.innerHTML = `
        <p class="font-medium text-slate-900 dark:text-white mb-1">${customer.firstName} ${customer.lastName}</p>
        <p class="mb-1">${customer.address}</p>
        <p>${customer.city}, ${customer.state} ${customer.zipCode}</p>
        <p class="mt-2 text-sm">
            <span class="font-medium">Phone:</span> ${customer.phone}
        </p>
    `;
}

function renderPaymentMethod() {
    const paymentMethodEl = document.getElementById('payment-method');
    if (!paymentMethodEl || !orderData || !orderData.paymentMethod) return;

    const method = orderData.paymentMethod;
    let icon = '';
    let label = '';

    switch (method) {
        case 'card':
            icon = '<i class="fa-solid fa-credit-card text-2xl text-blue-600"></i>';
            label = 'Credit/Debit Card';
            break;
        case 'paypal':
            icon = '<i class="fa-brands fa-paypal text-2xl text-blue-600"></i>';
            label = 'PayPal';
            break;
        case 'cod':
            icon = '<i class="fa-solid fa-money-bill text-2xl text-green-600"></i>';
            label = 'Cash on Delivery';
            break;
        default:
            icon = '<i class="fa-solid fa-credit-card text-2xl text-gray-600"></i>';
            label = method;
    }

    paymentMethodEl.innerHTML = `${icon} <span class="font-medium">${label}</span>`;
}

function renderOrderTotals() {
    if (!orderData || !orderData.totals) return;

    const totals = orderData.totals;

    const subtotalEl = document.getElementById('order-subtotal');
    const shippingEl = document.getElementById('order-shipping');
    const taxEl = document.getElementById('order-tax');
    const totalEl = document.getElementById('order-total');

    if (subtotalEl) subtotalEl.textContent = `$${totals.subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = `$${totals.shipping.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${totals.tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${totals.total.toFixed(2)}`;
}

function setDeliveryDate() {
    const deliveryDateEl = document.getElementById('delivery-date');
    if (!deliveryDateEl) return;

    // Calculate delivery date (5-7 business days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7);

    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    deliveryDateEl.textContent = deliveryDate.toLocaleDateString('en-US', options);
}

