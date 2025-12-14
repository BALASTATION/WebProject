const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise'); // Используем промисы для асинхронности
const bcrypt = require('bcrypt'); // Для хеширования паролей

const app = express();
const PORT = 3000;
const saltRounds = 10; // Количество раундов хеширования

// --- 1. Конфигурация MySQL ---
const pool = mysql.createPool({
    host: 'localhost', // или ваш хост
    user: 'root',      // или ваш пользователь
    password: '1111', // !!! Замените на ваш пароль !!!
    database: 'stroimag_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// --- 2. Middleware Express ---
// Middleware для парсинга тела запроса в формате application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// Middleware для парсинга тела запроса в формате application/json
app.use(express.json());
// Middleware для отдачи статических файлов (HTML, CSS и т.д.)
app.use(express.static(path.join(__dirname, '')));

// Упрощенная проверка, чтобы убедиться, что база данных доступна
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
        // 1. Хеширование пароля
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // 2. Вставка пользователя в БД
        const [result] = await pool.execute(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            [name, email, passwordHash]
        );

        console.log(`Пользователь ${name} успешно зарегистрирован. ID: ${result.insertId}`);

        // 3. Отправка успешного ответа и перенаправление на страницу входа
        // В реальном приложении здесь должна быть установка сессии/токена
        res.redirect('/login.html?registered=true');

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
    // В вашем HTML-коде используется 'email' и 'password', используем их.
    const { email, password } = req.body;

    try {
        // 1. Поиск пользователя по email
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        const user = rows[0];

        if (!user) {
            // Пользователь не найден
            return res.status(401).send('Неверный Email или пароль.');
        }

        // 2. Сравнение хешей пароля
        const match = await bcrypt.compare(password, user.password_hash);

        if (match) {
            // Успешный вход
            // В реальном приложении здесь должна быть установка сессии/токена

            // Для простоты перенаправляем на главную страницу
            res.redirect('/index.html?loggedIn=true');
        } else {
            // Пароль не совпадает
            res.status(401).send('Неверный Email или пароль.');
        }

    } catch (error) {
        console.error('Ошибка входа:', error);
        res.status(500).send('Ошибка сервера при входе.');
    }
});

// --- 5. Обработка запроса HTML-страниц (fallback) ---
// Этот маршрут нужен, чтобы Express мог обслуживать ваши HTML файлы, если они не являются статическими
app.get('/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, filename);

    // Проверяем, существует ли файл
    if (path.extname(filename) === '.html' && fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        // Express.static обрабатывает все остальные файлы, поэтому здесь будет только 404 для HTML, которые не существуют
        res.status(404).sendFile(path.join(__dirname, '404.html')); // Представьте, что у вас есть 404.html
    }
});


// --- 6. Запуск сервера ---
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    console.log('Для остановки сервера нажмите Ctrl+C');
});