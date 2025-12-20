// auth-helper.js
document.addEventListener('DOMContentLoaded', () => {
    const authLink = document.querySelector('.login'); // Находим кнопку "Войти"

    // 1. Проверяем, есть ли данные в URL (после редиректа с сервера)
    const urlParams = new URLSearchParams(window.location.search);
    const usernameFromUrl = urlParams.get('username');
    const isLoggedIn = urlParams.get('loggedIn') === 'true' || urlParams.get('registered') === 'true';

    if (isLoggedIn && usernameFromUrl) {
        // Сохраняем имя в локальное хранилище, чтобы оно не пропадало при переходе по ссылкам
        localStorage.setItem('username', usernameFromUrl);
    }

    // 2. Проверяем, сохранено ли имя пользователя в браузере
    const storedUsername = localStorage.getItem('username');

    if (storedUsername && authLink) {
        // Меняем "Войти" на имя пользователя + добавляем кнопку выхода
        authLink.parentElement.innerHTML = `
            <span class="user-name" style="margin-right: 15px; font-weight: 600;">👋 ${decodeURIComponent(storedUsername)}</span>
            <a href="#" id="logout-btn" style="color: #ff4d4d; text-decoration: none; font-size: 0.8em;">Выйти</a>
        `;

        // Логика выхода
        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('username');
            window.location.href = 'index.html';
        });
    }
});