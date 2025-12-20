const http = require('http');
const path = require('path');
const mysql = require('mysql2/promise');
const fs = require('fs');
const querystring = require('querystring');

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

// Вспомогательная функция для чтения тела POST-запроса
const getRequestBody = (req) => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            // Проверяем тип контента для парсинга
            const contentType = req.headers['content-type'];
            if (contentType === 'application/json') {
                resolve(JSON.parse(body || '{}'));
            } else {
                resolve(querystring.parse(body));
            }
        });
        req.on('error', reject);
    });
};

// --- Основная логика сервера ---
const server = http.createServer(async (req, res) => {
    const { method, url } = req;
    const parsedUrl = new URL(url, `http://localhost:${PORT}`);
    const pathname = parsedUrl.pathname;

    try {
        // --- 3. Обработка Регистрации (POST /register) ---
        if (method === 'POST' && pathname === '/register') {
            const body = await getRequestBody(req);
            const { name, email, password, 'confirm-password': confirmPassword } = body;

            if (password !== confirmPassword) {
                res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
                return res.end('Пароли не совпадают!');
            }

            try {
                await pool.execute(
                    'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
                    [name, email, password]
                );
                console.log(`Пользователь ${name} зарегистрирован.`);
                res.writeHead(302, { 'Location': `/login.html?registered=true&username=${encodeURIComponent(name)}` });
                return res.end();
            } catch (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    res.writeHead(409, { 'Content-Type': 'text/plain; charset=utf-8' });
                    return res.end('Пользователь с таким email или именем уже существует.');
                }
                throw error;
            }
        }

        // --- 4. Обработка Входа (POST /login) ---
        else if (method === 'POST' && pathname === '/login') {
            const body = await getRequestBody(req);
            const { email, password } = body;

            const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
            const user = rows[0];

            if (user && password === user.password_hash) {
                res.writeHead(302, { 'Location': `/index.html?loggedIn=true&username=${encodeURIComponent(user.username)}` });
                return res.end();
            } else {
                res.writeHead(401, { 'Content-Type': 'text/plain; charset=utf-8' });
                return res.end('Неверный Email или пароль.');
            }
        }

        // --- 5. Получение товаров (GET /api/products) ---
        else if (method === 'GET' && pathname === '/api/products') {
            const [rows] = await pool.execute('SELECT * FROM products');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify(rows));
        }

        // --- 6. Статические файлы и Fallback ---
        else {
            // Если путь "/", отдаем index.html
            let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);

            if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
                const ext = path.extname(filePath);
                const contentTypes = {
                    '.html': 'text/html',
                    '.css': 'text/css',
                    '.js': 'text/javascript',
                    '.png': 'image/png',
                    '.jpg': 'image/jpeg'
                };

                res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'application/octet-stream' });
                return fs.createReadStream(filePath).pipe(res);
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                return res.end('Страница не найдена');
            }
        }

    } catch (error) {
        console.error('Ошибка сервера:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Ошибка сервера');
    }
});

// Проверка подключения и запуск
pool.getConnection().then(() => {
    console.log("Успешное подключение к MySQL!");
    server.listen(PORT, () => {
        console.log(`Сервер запущен на http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error("ОШИБКА ПОДКЛЮЧЕНИЯ К MYSQL:", err.message);
});