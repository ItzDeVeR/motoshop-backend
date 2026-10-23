const db = require('./db');

function addUser(firstname, login, password) {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO users (firstname, login, password, role) VALUES (?, ?, ?, ?)`;
        const params = [firstname, login, password, "user"];

        db.run(sql, params, function (err) {
            if (err) {
                if (err.message.includes('users.login')) resolve(false);
                else
                    reject(err);
            } else {
                resolve(true);
            }
        });
    })
}

function getAllUsers() {
    return new Promise((resolve, reject) => {
        const sql = `SELECT id, firstname, login, adress, role FROM users ORDER BY login;`;

        db.all(sql, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    })
}

function getUserByLogin(login, password) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM users WHERE login = ? AND password = ?`;
        const params = [login, password];

        db.get(sql, params, function (err, result) {
            if (err) reject(err);
            else resolve(result);
        })
    })
}

function getUserRole(id) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT role FROM users WHERE id = ?`;
        const params = [id];

        db.get(sql, params, function (err, result) {
            if (err) reject(err);
            else resolve(result);
        })
    })
}

function getUserByID(id) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT id, firstname, login, adress, role FROM users where id = ?`;
        const params = [id];

        db.get(sql, params, function (err, result) {
            if (err)
                return reject(err);
            if (result === undefined) {
                return reject(new Error("Пользователь не найден"));
            }
            resolve(result);
        })
    })
}

function getRoleByID(id) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT role FROM users WHERE id = ?`;
        const params = [id];

        db.get(sql, params, function (err, result) {
            if (err) reject(err);
            else resolve(result);
        })
    })
}

function deleteUserByID(id) {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM users WHERE id = ?`;
        const params = [id];

        db.run(sql, params, function (err) {
            if (err) reject(err);
            else if (this.changes === 0) reject(new Error("Пользователя не существует"))
            else resolve(this.changes);
        })
    })
}

function changeUserData(firstname, login, password, adress, role, id) {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE users SET firstname = ?, login = ?, password = ?, adress = ?, role = ? WHERE id = ?`;
        const params = [firstname, login, password, adress, role, id];

        db.run(sql, params, function (err, result) {
            if (err) return reject(new Error("Пользователь не найден"));
            else resolve(result);
        })
    })
}

module.exports = {
    addUser,
    getUserByLogin,
    getUserByID,
    changeUserData,
    getAllUsers,
    getRoleByID,
    deleteUserByID,
    getUserRole
}
