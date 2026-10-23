const db = require('./db');

function getAllProducts() {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM PRODUCTS ORDER BY stock DESC`;

        db.all(sql, (err, result) => {
            if (!result) return reject(new Error('Продукты не найден'));

            return resolve(result)
        })
    })
}

function getProductById(id) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM products WHERE id = ?`;
        const params = [id];

        db.get(sql, params, (err, result) => {
            if (!result) return reject(new Error('Товар не был найден :с'));

            return resolve(result)
        })
    })
}

function updateCountOfProduct(productItem) {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE products SET stock = stock - ? WHERE id = ?`;
        const params = [productItem.count, productItem.id];

        db.run(sql, params, function (err, result) {
            if (err) return reject(new Error('Ошибка! Не удалось обновить данные товара'));
            return resolve(result);
        })
    })
}

function updateProduct(name, category, price, stock, description, productID) {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE products SET name = ?, category = ?, price = ?, stock = ?, description = ? WHERE id = ?`;
        const params = [name, category, price, stock, description, productID];

        db.run(sql, params, function (err) {
            if (err) return reject(new Error('Ошибка! Не удалось обновить данные товара => ' + err.message ));
            if (this.changes === 0) return reject(new Error("Товар не найден"))
            return resolve(this.changes);
        })
    })
}

function createProduct(name, category, price, stock, description) {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO products (name, category, price, stock, description) VALUES (?, ?, ?, ?, ?)`;
        const params = [name, category, price, stock, description];

        db.run(sql, params, function (err) {
            if (err) return reject(new Error('Ошибка создания => ' + err.message));
            return resolve(this.changes);
        })
    })
}

function deleteProduct(productID){
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM products WHERE id = ?`;
        const params = [productID];

        db.run(sql, params, function (err) {
            if (err) return reject(new Error('Ошибка удаления => ' + err.message));
            if (this.changes === 0) return reject(new Error("Товар не выбран или не существует"))
            return resolve(this.changes);
        })
    })
}

module.exports = {getProductById, getAllProducts, updateCountOfProduct, updateProduct, createProduct, deleteProduct}
