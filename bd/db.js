const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./bd/database.db', (err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err.message);
    } else {
        console.log('Успешное подключение к базе данных SQLite');
    }
});

db.run("PRAGMA foreign_keys = ON");

process.on('SIGINT', () => {
    db.close();
    process.exit();
});

module.exports = db;
