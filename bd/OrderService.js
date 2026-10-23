const db = require('./db');

function getOrdersByUserID(id) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT o.id, o.status, o.created_at, SUM(oi.quantity) AS quantity, SUM(oi.price_at_purchase) AS price_at_purchase
                    FROM orders o
                    JOIN order_items oi ON o.id = oi.order_id
                    WHERE o.user_id = ?
                    GROUP BY o.id`
        const params = [id];

        db.all(sql, params, (err, result) => {
            if (!result) return reject(new Error('Заказ не найден'));

            return resolve(result);
        })
    });
}

function getProductsByOrderID(id) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT p.id, p.name, p.price, oi.quantity, oi.price_at_purchase
                    FROM products p
                    JOIN order_items oi ON oi.product_id = p.id
                    WHERE oi.order_id = ?`
        const params = [id];

        db.all(sql, params, (err, result) => {
            if (!result) return reject(new Error('Товар не найден'));

            return resolve(result);
        })
    });
}

function CreateOrder(id) {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO orders (user_id) VALUES (?)`;
        const params = [id];

        db.run(sql, params, function (err, result) {
                if (err) {
                    if (err.message.includes('FOREIGN KEY')) resolve(false);
                    else reject(false)
                } else
                    resolve(this.lastID);
            }
        )
    })
}

function CreateOrderItem(orderID, orderedProducts) {
    return new Promise((resolve, reject) => {
        const placeholders = orderedProducts.map(() => '(?, ?, ?, ?)').join(', ');
        const sql = `INSERT INTO order_items
                    (order_id, product_id, quantity, price_at_purchase)
                    VALUES ${placeholders}`;

        const params = orderedProducts.flatMap(item => [
            orderID,
            item.id,
            item.count,
            item.price
        ]);

        db.run(sql, params, function (err, result) {
            if (err) {
                reject(err.message);
            } else {
                resolve(this.lastID);
            }
        })
    })
}

function changeStatus(status, orderID, userID) {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE orders SET status = ? WHERE id = ? AND user_id = ?`;
        const params = [status, orderID, userID];

        db.run(sql, params, function (err, result) {
            if (err) reject(new Error("Ошибочка => " + err.message))
            else resolve(this.changes);
        })
    })
}

function getAllOrders() {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM orders`;

        db.all(sql, function (err, result) {
            if (err) reject(new Error("Ошибка получения заказов => " + err.message))
            else resolve(result);
        })
    })
}

function getOrderInfo(orderID) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT oi.id, name, price_at_purchase, quantity
                            FROM order_items oi
                            JOIN products p ON oi.product_id = p.id
                            WHERE oi.order_id = ?`;
        const params = [orderID];

        db.all(sql, params, function (err, result) {
            if (err) return reject(new Error("Ошибка при получении информации о заказе => " + err.message))
            if (result.length <= 0) {
                return reject(new Error("Заказ не найден"));
            }
            return resolve(result);
        })
    })
}

function deleteOrder(orderID){
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM orders WHERE id = ?`;
        const params = [orderID];

        db.run(sql, params, function (err) {
            if (err)
                return reject(new Error("Ошибка при удалении => " + err.message))
            if (this.changes === 0) return reject(new Error("Заказ не найден"))
            return resolve(this.changes);
        })
    })
}

function changeOrderStatus(orderID, newStatus) {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE orders SET status = ? WHERE id = ?`;
        const params = [newStatus, orderID];

        db.run(sql, params, function (err) {
            if (err) return reject(new Error("Ошибка при изменении => " + err.message))
            if (this.changes === 0) return reject(new Error("Заказ не найден"))
            return resolve(this.changes);
        })
    })
}

module.exports = {
    getOrdersByUserID,
    getProductsByOrderID,
    CreateOrder,
    CreateOrderItem,
    changeStatus,
    getAllOrders,
    getOrderInfo,
    deleteOrder,
    changeOrderStatus
}
