const http = require('http');
const path = require('path');
const mysql = require('mysql2/promise');
const fs = require('fs');
const querystring = require('querystring');

const PORT = 3000;

//конфигурация MySQL
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1111', //свой пароль
    database: 'stroimag_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const getRequestBody = (req) => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
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

const sendJsonResponse = (res, statusCode, data) => {
    res.writeHead(statusCode, { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify(data));
};


const server = http.createServer(async (req, res) => {
    const { method, url } = req;
    const parsedUrl = new URL(url, `http://localhost:${PORT}`);
    const pathname = parsedUrl.pathname;

    try {
        //регистрация
        if (method === 'POST' && pathname === '/register') {
            const body = await getRequestBody(req);
            const { name, email, password, 'confirm-password': confirmPassword } = body;

            if (!name || !email || !password || !confirmPassword) {
                sendJsonResponse(res, 400, { error: 'Все поля обязательны для заполнения' });
                return;
            }

            if (password !== confirmPassword) {
                sendJsonResponse(res, 400, { error: 'Пароли не совпадают' });
                return;
            }

            try {
                await pool.execute(
                    'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
                    [name, email, password]
                );
                console.log(`Пользователь ${name} зарегистрирован.`);
                sendJsonResponse(res, 200, { 
                    success: true, 
                    message: 'Регистрация успешна',
                    username: name 
                });
            } catch (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    sendJsonResponse(res, 409, { error: 'Пользователь с таким email или именем уже существует.' });
                } else {
                    console.error('Ошибка регистрации:', error);
                    sendJsonResponse(res, 500, { error: 'Ошибка сервера при регистрации' });
                }
            }
        }

        //вход
        else if (method === 'POST' && pathname === '/login') {
            const body = await getRequestBody(req);
            const { email, password } = body;

            if (!email || !password) {
                sendJsonResponse(res, 400, { error: 'Email и пароль обязательны' });
                return;
            }

            try {
                const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
                const user = rows[0];

                if (user && password === user.password_hash) {
                    sendJsonResponse(res, 200, { 
                        success: true, 
                        message: 'Вход выполнен успешно',
                        username: user.username 
                    });
                } else {
                    sendJsonResponse(res, 401, { error: 'Неверный Email или пароль.' });
                }
            } catch (error) {
                console.error('Ошибка входа:', error);
                sendJsonResponse(res, 500, { error: 'Ошибка сервера при входе' });
            }
        }

        //получение товаров из бд
        else if (method === 'GET' && pathname === '/api/products') {
            try {
                const [rows] = await pool.execute('SELECT * FROM products');
                res.writeHead(200, { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                return res.end(JSON.stringify(rows));
            } catch (error) {
                console.error('Ошибка получения товаров:', error);
                sendJsonResponse(res, 500, { error: 'Ошибка получения данных товаров' });
            }
        }

        //сохранение заказа
        else if (method === 'POST' && pathname === '/api/orders') {
            try {
                const body = await getRequestBody(req);
                
                if (!body.userId) {
                    sendJsonResponse(res, 401, { error: 'Пользователь не авторизован' });
                    return;
                }

                const [result] = await pool.execute(
                    'INSERT INTO orders (user_id, address, phone, email, payment_method, total_amount, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [
                        body.userId,
                        `${body.address.street}, д. ${body.address.house}${body.address.entrance ? `, подъезд ${body.address.entrance}` : ''}${body.address.apartment ? `, кв. ${body.address.apartment}` : ''}`,
                        body.phone,
                        body.email,
                        body.paymentMethod,
                        body.total,
                        'Новый'
                    ]
                );

                const orderId = result.insertId;

                if (body.items && body.items.length > 0) {
                    for (const item of body.items) {
                        await pool.execute(
                            'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                            [orderId, item.id, item.quantity, item.price]
                        );
                    }
                }

                console.log(`Заказ №${orderId} сохранен.`);
                sendJsonResponse(res, 200, { 
                    success: true, 
                    message: 'Заказ успешно сохранен',
                    orderId: orderId 
                });
            } catch (error) {
                console.error('Ошибка сохранения заказа:', error);
                sendJsonResponse(res, 500, { error: 'Ошибка сохранения заказа' });
            }
        }

        else {
            let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
            
            if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
                const ext = path.extname(filePath);
                const contentTypes = {
                    '.html': 'text/html; charset=utf-8',
                    '.css': 'text/css; charset=utf-8',
                    '.js': 'text/javascript; charset=utf-8',
                    '.png': 'image/png',
                    '.jpg': 'image/jpeg',
                    '.svg': 'image/svg+xml'
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
        sendJsonResponse(res, 500, { error: 'Внутренняя ошибка сервера' });
    }
});


pool.getConnection().then(() => {
    console.log("Успешное подключение к MySQL!");
    server.listen(PORT, () => {
        console.log(`Сервер запущен на http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error("ОШИБКА ПОДКЛЮЧЕНИЯ К MYSQL:", err.message);
});