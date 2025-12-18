const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');
const fs = require('fs'); // Добавлено для работы маршрута fallback

const app = express();
const PORT = 3000;

// --- 1. Конфигурация MySQL ---
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Bez-b0sh',
    database: 'stroimag_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// --- 2. Middleware Express ---
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '')));

pool.getConnection().then(() => {
    console.log("Успешное подключение к MySQL!");
}).catch(err => {
    console.error("ОШИБКА ПОДКЛЮЧЕНИЯ К MYSQL:", err.message);
});

// --- 3. Обработка Регистрации (POST /register) ---
app.post('/register', async (req, res) => {
    const { name, email, password, 'confirm-password': confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).send('Пароли не совпадают!');
    }

    try {
        // Вставляем пароль напрямую БЕЗ хеширования
        const [result] = await pool.execute(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            [name, email, password] // Используем password вместо хеша
        );

        console.log(`Пользователь ${name} успешно зарегистрирован.`);

        // Передаем имя пользователя в URL для отображения в шапке (как обсуждалось ранее)
        res.redirect(`/login.html?registered=true&username=${encodeURIComponent(name)}`);

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).send('Пользователь с таким email или именем уже существует.');
        }
        console.error('Ошибка регистрации:', error);
        res.status(500).send('Ошибка сервера при регистрации.');
    }
});

// --- 4. Обработка Входа (POST /login) ---
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        const user = rows[0];

        if (!user) {
            return res.status(401).send('Неверный Email или пароль.');
        }

        // Прямое сравнение строк вместо bcrypt.compare
        if (password === user.password_hash) {
            // Успешный вход: передаем имя в URL для скрипта на фронтенде
            res.redirect(`/index.html?loggedIn=true&username=${encodeURIComponent(user.username)}`);
        } else {
            res.status(401).send('Неверный Email или пароль.');
        }

    } catch (error) {
        console.error('Ошибка входа:', error);
        res.status(500).send('Ошибка сервера при входе.');
    }
});

// --- 5. Обработка запроса HTML-страниц (fallback) ---
app.get('/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, filename);

    if (path.extname(filename) === '.html' && fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('Страница не найдена');
    }
});
// --- Получение товаров из БД ---
app.get('/api/products', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM products');
        res.json(rows); // Отправляем данные клиенту
    } catch (error) {
        console.error('Ошибка при получении товаров:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});
// --- 6. Запуск сервера ---
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});