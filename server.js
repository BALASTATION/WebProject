const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Определяем MIME-типы для различных расширений файлов
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// Создаем HTTP сервер
const server = http.createServer((req, res) => {
    // Убираем параметры запроса (если есть) и нормализуем URL
    let filePath = '.' + req.url.split('?')[0];

    // Если запрос к корню, отдаем index.html
    if (filePath === './' || filePath === './index') {
        filePath = './index.html';
    }

    // Получаем расширение файла
    const extname = path.extname(filePath);
    let contentType = mimeTypes[extname] || 'text/plain';

    // Читаем файл
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // Файл не найден
                fs.readFile('./404.html', (error404, content404) => {
                    if (error404) {
                        // Если нет 404.html, отдаем простую ошибку
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end('<h1>404 - Страница не найдена</h1>', 'utf-8');
                    } else {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end(content404, 'utf-8');
                    }
                });
            } else {
                // Другая ошибка сервера
                res.writeHead(500);
                res.end(`Ошибка сервера: ${error.code}`);
            }
        } else {
            // Успешный ответ
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// Запускаем сервер
server.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    console.log('Для остановки сервера нажмите Ctrl+C');
});