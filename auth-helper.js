document.addEventListener('DOMContentLoaded', () => {
    const headerActions = document.querySelector('.header-actions');
    
    // Проверяем параметры URL после успешной регистрации/входа
    const urlParams = new URLSearchParams(window.location.search);
    const usernameFromUrl = urlParams.get('username');
    const isLoggedIn = urlParams.get('loggedIn') === 'true' || urlParams.get('registered') === 'true';

    if (isLoggedIn && usernameFromUrl) {
        localStorage.setItem('username', decodeURIComponent(usernameFromUrl));
        localStorage.setItem('isLoggedIn', 'true');
        // Убираем параметры из URL
        window.history.replaceState({}, document.title, window.location.pathname);
        updateHeaderActions();
    }

    // Проверяем localStorage
    updateHeaderActions();
});

function updateHeaderActions() {
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
            updateHeaderActions();
            // Если на странице входа, перезагружаем
            if (window.location.pathname.includes('login.html')) {
                window.location.reload();
            } else {
                // В основном приложении обновляем отображение
                updateHeaderActions();
                if (typeof showPage === 'function') {
                    showPage('home');
                }
            }
        });
    } else {
        headerActions.innerHTML = `
            <a href="#" onclick="showPage('cart')" class="cart">Корзина</a>
            <a href="login.html" class="login">Войти</a>
        `;
    }
}

// Глобальная функция для обновления количества товара в корзине
window.updateCartQty = function(productId, delta, name, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const idx = cart.findIndex(item => item.id === productId);

    if (idx > -1) {
        cart[idx].quantity += delta;
        if (cart[idx].quantity <= 0) cart.splice(idx, 1);
    } else {
        cart.push({ id: productId, name, price, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    // Вызываем обновление интерфейса в каталоге, если мы там
    if (typeof applyFilters === 'function') {
        applyFilters();
    }
};