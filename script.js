let allProducts = [];
let currentFilters = { category: 'all', sort: 'default' };
let currentPage = 'home';

function showPage(pageId) {
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    const targetSection = document.getElementById(pageId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        currentPage = pageId;

        if (pageId === 'home') {
            loadPopularProducts();
        } else if (pageId === 'catalog') {
            loadCatalog();
        } else if (pageId === 'cart') {
            renderCart();
            
            document.getElementById('checkout-section').classList.add('hidden');
            document.getElementById('cart-content').classList.remove('hidden');
        }
    }
    
    updateUserDisplay();
}

function updateUserDisplay() {
    const headerActions = document.querySelector('.header-actions');
    if (!headerActions) return;

    const storedUsername = localStorage.getItem('username');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (isLoggedIn && storedUsername) {
        const maxLength = 10;
        const displayName = storedUsername.length > maxLength
            ? storedUsername.substring(0, maxLength) + '...'
            : storedUsername;

        headerActions.innerHTML = `
            <a href="#" onclick="showPage('cart')" class="cart">Корзина</a>
            <div style="display: flex; align-items: center; gap: 15px; margin-left: 15px;">
                <span class="user-name" title="${storedUsername}" style="
                    font-weight: 700; color: #ffffff; background: #e74c3c;
                    padding: 4px 10px; border-radius: 4px; max-width: 120px; 
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                ">${displayName}</span>
                <a href="#" id="logout-btn" style="
                    color: #ffffff; text-decoration: none; font-size: 0.8em; 
                    padding: 5px 12px; border: 2px solid #ffffff; 
                    border-radius: 4px; font-weight: bold;
                ">ВЫЙТИ</a>
            </div>
        `;

        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('username');
            localStorage.removeItem('isLoggedIn');
            updateUserDisplay();
            showPage('home');
        });
    } else {
        headerActions.innerHTML = `
            <a href="#" onclick="showPage('cart')" class="cart">Корзина</a>
            <a href="login.html" class="login">Войти</a>
        `;
    }
}

function goToCategory(categoryName) {
    currentFilters.category = categoryName;
    showPage('catalog');
}

// корзина
function updateCartQty(productId, delta, productName = null, productPrice = null) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIndex = cart.findIndex(item => item.id === productId);
    
    if (productIndex !== -1) {
        cart[productIndex].quantity += delta;
        if (cart[productIndex].quantity <= 0) {
            cart.splice(productIndex, 1);
        }
    } else if (delta > 0 && productName && productPrice) {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    if (currentPage === 'cart') {
        renderCart();
    } else if (currentPage === 'catalog') {
        applyFilters();
    } else if (currentPage === 'home') {
        loadPopularProducts();
    }
}

function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('cart-items-container');
    const summary = document.getElementById('cart-summary-area');
    
    if (!container || !summary) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<p>Корзина пуста</p>';
        summary.innerHTML = '<p>Добавьте товары в корзину</p>';
        return;
    }
    
    let total = 0;
    let itemsHtml = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        itemsHtml += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>${item.price} ₽ × ${item.quantity} = ${itemTotal} ₽</p>
                </div>
                <div class="cart-item-actions">
                    <button onclick="updateCartQty(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateCartQty(${item.id}, 1)">+</button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = itemsHtml;
    summary.innerHTML = `
        <h3>Итого</h3>
        <p>Товары: ${cart.length}</p>
        <p>Общая сумма: ${total} ₽</p>
        <button class="checkout-btn" onclick="startCheckout()">ОФОРМИТЬ ЗАКАЗ</button>
    `;
}

// заказ
function startCheckout() {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        alert('Пожалуйста, войдите в систему для оформления заказа');
        window.location.href = 'login.html';
        return;
    }
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('Корзина пуста');
        return;
    }
    
    document.getElementById('cart-content').classList.add('hidden');
    document.getElementById('checkout-section').classList.remove('hidden');
    
    renderOrderSummary();
    
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'card') {
                document.getElementById('card-details').style.display = 'block';
            } else {
                document.getElementById('card-details').style.display = 'none';
            }
        });
    });
}

function backToCart() {
    document.getElementById('checkout-section').classList.add('hidden');
    document.getElementById('cart-content').classList.remove('hidden');
}

function renderOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderItems = document.getElementById('order-items');
    const subtotalElement = document.getElementById('order-subtotal');
    const totalElement = document.getElementById('order-total');
    
    let subtotal = 0;
    let itemsHtml = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        itemsHtml += `
            <div class="order-item">
                <span>${item.name} × ${item.quantity}</span>
                <span>${itemTotal} ₽</span>
            </div>
        `;
    });
    
    // бесплатная доставка
    const deliveryCost = subtotal >= 50000 ? 0 : 500;
    const total = subtotal + deliveryCost;
    
    orderItems.innerHTML = itemsHtml;
    subtotalElement.textContent = `${subtotal} ₽`;
    document.getElementById('order-delivery').textContent = deliveryCost === 0 ? 'Бесплатно' : `${deliveryCost} ₽`;
    totalElement.textContent = `${total} ₽`;
}

//подтверждение заказа
function confirmOrder() {
    const street = document.getElementById('address-street').value;
    const house = document.getElementById('address-house').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    if (!street || !house || !phone || !email) {
        alert('Пожалуйста, заполните все обязательные поля');
        return;
    }
    
    if (paymentMethod === 'card') {
        const cardNumber = document.getElementById('card-number').value;
        const cardExpiry = document.getElementById('card-expiry').value;
        const cardCvv = document.getElementById('card-cvv').value;
        const cardHolder = document.getElementById('card-holder').value;
        
        if (!cardNumber || !cardExpiry || !cardCvv || !cardHolder) {
            alert('Пожалуйста, заполните данные банковской карты');
            return;
        }
        
        const cleanCardNumber = cardNumber.replace(/\s/g, '');
        if (cleanCardNumber.length !== 16 || !/^\d+$/.test(cleanCardNumber)) {
            alert('Некорректный номер карты. Введите 16 цифр');
            return;
        }
    }
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryCost = subtotal >= 50000 ? 0 : 500;
    const total = subtotal + deliveryCost;
    
    const order = {
        id: Date.now(),
        date: new Date().toLocaleString('ru-RU'),
        items: cart,
        address: {
            street: street,
            house: house,
            entrance: document.getElementById('address-entrance').value,
            apartment: document.getElementById('address-apartment').value
        },
        contact: {
            phone: phone,
            email: email
        },
        payment: paymentMethod,
        subtotal: subtotal,
        delivery: deliveryCost,
        total: total,
        status: 'Новый'
    };
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    localStorage.removeItem('cart');
    
    showOrderConfirmation(order);
}

function showOrderConfirmation(order) {
    document.getElementById('checkout-section').classList.add('hidden');
    
    const confirmationHTML = `
        <div class="order-confirmation">
            <h3>ЗАКАЗ УСПЕШНО ОФОРМЛЕН!</h3>
            <div class="confirmation-details">
                <p><strong>Номер заказа:</strong> ${order.id}</p>
                <p><strong>Дата заказа:</strong> ${order.date}</p>
                <p><strong>Сумма заказа:</strong> ${order.total} ₽</p>
                <p><strong>Статус:</strong> ${order.status}</p>
                <p><strong>Адрес доставки:</strong> ${order.address.street}, д. ${order.address.house}${
                    order.address.entrance ? `, подъезд ${order.address.entrance}` : ''
                }${order.address.apartment ? `, кв. ${order.address.apartment}` : ''}</p>
                <p><strong>Телефон:</strong> ${order.contact.phone}</p>
                <p><strong>Способ оплаты:</strong> ${
                    order.payment === 'card' ? 'Банковская карта' : 'Наличными курьеру'
                }</p>
            </div>
            <div class="confirmation-items">
                <h4>Состав заказа:</h4>
                ${order.items.map(item => `
                    <div class="confirmation-item">
                        <span>${item.name} × ${item.quantity}</span>
                        <span>${item.price * item.quantity} ₽</span>
                    </div>
                `).join('')}
            </div>
            <p class="confirmation-note">
                Спасибо за заказ! Наш менеджер свяжется с вами в ближайшее время для подтверждения заказа и уточнения деталей доставки.
            </p>
            <div class="confirmation-actions">
                <button class="btn-primary" onclick="showPage('home')">НА ГЛАВНУЮ</button>
                <button class="btn-secondary" onclick="continueShopping()">ПРОДОЛЖИТЬ ПОКУПКИ</button>
            </div>
        </div>
    `;
    
    const cartSection = document.getElementById('cart');
    const existingConfirmation = cartSection.querySelector('.order-confirmation');
    if (existingConfirmation) {
        existingConfirmation.remove();
    }
    
    const cartContent = document.getElementById('cart-content');
    cartContent.innerHTML = confirmationHTML;
    cartContent.classList.remove('hidden');
}

function continueShopping() {
    showPage('catalog');
}

function checkout() {
    startCheckout();
}

async function loadCatalog() {
    try {
        const response = await fetch('/api/products');
        allProducts = await response.json();
        renderCategories();
        applyFilters();
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
    }
}

async function loadPopularProducts() {
    try {
        const demoProducts = [
            {id: 1, name: 'Дрель электрическая', price: 5000, category: 'Инструменты'},
            {id: 2, name: 'Молоток', price: 800, category: 'Инструменты'},
            {id: 3, name: 'Саморезы 100 шт', price: 150, category: 'Крепеж'},
            {id: 4, name: 'Гвозди 1 кг', price: 200, category: 'Крепеж'},
            {id: 5, name: 'Смеситель для раковины', price: 2500, category: 'Сантехника'},
            {id: 6, name: 'Труба ПВХ', price: 350, category: 'Сантехника'},
            {id: 7, name: 'Лампа светодиодная', price: 300, category: 'Электрика'},
            {id: 8, name: 'Розетка двойная', price: 180, category: 'Электрика'},
            {id: 9, name: 'Перфоратор', price: 7500, category: 'Инструменты'},
            {id: 10, name: 'Шуруповерт', price: 4200, category: 'Инструменты'}
        ];
        renderProducts(demoProducts, '#popular-products-container');
    } catch (error) {
        console.error('Ошибка загрузки популярных товаров:', error);
    }
}

function renderCategories() {
    const list = document.getElementById('category-list');
    if (!list) return;
    
    const categories = ['all', ...new Set(allProducts.map(p => p.category).filter(Boolean))];
    list.innerHTML = categories.map(cat => `
        <li>
            <a href="#" onclick="setCategory('${cat}')" 
               ${currentFilters.category === cat ? 'class="active-cat"' : ''}>
                ${cat === 'all' ? 'Все товары' : cat}
            </a>
        </li>
    `).join('');
}

function setCategory(cat) {
    currentFilters.category = cat;
    renderCategories();
    applyFilters();
}

function setSort(val) {
    currentFilters.sort = val;
    applyFilters();
}

function applyFilters() {
    const searchInput = document.getElementById('catalog-search');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    
    let filtered = [...allProducts];
    
    if (currentFilters.category !== 'all') {
        filtered = filtered.filter(p => p.category === currentFilters.category);
    }
    
    if (searchTerm) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchTerm)
        );
    }
    
    if (currentFilters.sort === 'price-asc') {
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (currentFilters.sort === 'price-desc') {
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }
    
    renderProducts(filtered, '#products-container');
}

function renderProducts(items, containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    if (items.length === 0) {
        container.innerHTML = '<p>Товары не найдены</p>';
        return;
    }
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    container.innerHTML = items.map(product => {
        const cartItem = cart.find(item => item.id === product.id);
        const quantity = cartItem ? cartItem.quantity : 0;
        
        const actionHtml = quantity > 0 ? `
            <div class="product-quantity-controls">
                <button onclick="updateCartQty(${product.id}, -1)">-</button>
                <span>${quantity}</span>
                <button onclick="updateCartQty(${product.id}, 1)">+</button>
            </div>
        ` : `
            <button class="add-to-cart" 
                    onclick="updateCartQty(${product.id}, 1, '${product.name}', ${product.price})">
                В КОРЗИНУ
            </button>
        `;
        
        return `
            <div class="product-card">
                <div class="product-image">📦</div>
                <div class="product-info">
                    <span class="product-category">${product.category || 'Общее'}</span>
                    <h3>${product.name}</h3>
                    <div class="product-price">${parseFloat(product.price).toLocaleString()} ₽</div>
                    ${actionHtml}
                </div>
            </div>
        `;
    }).join('');
}

document.addEventListener('DOMContentLoaded', function() {
    // Форма обратной связи
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
            this.reset();
        });
    }
    
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value.length <= 1) value = '+7 (' + value;
                if (value.length > 1 && value.length <= 4) value = '+7 (' + value.substring(1);
                if (value.length > 4 && value.length <= 7) value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4);
                if (value.length > 7 && value.length <= 9) value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7) + '-' + value.substring(7, 9);
                if (value.length > 9) value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7) + '-' + value.substring(7, 9) + '-' + value.substring(9, 11);
            }
            this.value = value.substring(0, 18);
        });
    }
    
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = this.value.replace(/\D/g, '');
            value = value.substring(0, 16);
            let formatted = '';
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) formatted += ' ';
                formatted += value[i];
            }
            this.value = formatted;
        });
    }
    
    const cardExpiryInput = document.getElementById('card-expiry');
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', function(e) {
            let value = this.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            this.value = value.substring(0, 5);
        });
    }
    
    updateUserDisplay();
    
    showPage('home');
});