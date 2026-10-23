var jwt = require('jsonwebtoken');
const UserController = require("../bd/UserController");

exports.login = async (req, res) => {
    if (!req.body) return res.status(400).send("Не правильно отправлен запрос!");

    const curUser = await UserController.getUserByLogin(req.body.login, req.body.password);
    if (!curUser) return res.status(401).send("Неверный логин или пароль!");

    const {id} = curUser;

    const payload = {
        id
    }
    const token = jwt.sign(payload, process.env.SECRET, {expiresIn: "24h"})

    return res.json(token);
}

exports.register = async (req, res) => {
    const login = req.body.login;
    const password = req.body.password;
    const firstname = req.body.firstname;

    if (firstname.length < 4 || login.length < 4 || password.length < 4) return res.status(400).send("Все поля должены содержать минумум 4 символа")

    const userExist = await UserController.addUser(firstname, login, password);
    if (!userExist) return res.status(401).send("Данный логин уже занят!");

    return res.send("Успешная регистрация").status(200);
}

exports.getMe = async (req, res) => {
    const {id} = req.user;

    const curUser = await UserController.getUserByID(id).catch(err => console.error(err.message));
    if (!curUser) return res.status(401).json({message: 'Не авторизован'});

    return res.json(curUser);
}

exports.changeUserData = async (req, res) => {
    const {id} = req.user;
    const curUser = await UserController.getUserByID(id).catch(err => console.error(err.message));
    if (!curUser) return res.status(401).json({message: 'Не авторизован'});

    const curRole = await UserController.getRoleByID(id).catch(err => console.error(err.message));

    const {newFirstname, newLogin, newPassword, newAdress} = req.body;

    try {
        if (newFirstname.length < 5 || newLogin.length < 5 || newPassword.length < 5 || newAdress.length < 5) return res.status(400).json({message: "Одно или несколько полей содержат 4 и меньше символов"})

        await UserController.changeUserData(newFirstname, newLogin, newPassword, newAdress, curRole.role, id);
    } catch (err) {
        return res.status(400).json({message: "Не правильные данные => " + err.message})
    }

    return res.json({message: "Данные изменены"})
}

exports.changeUserDataAdmin = async (req, res) => {
    const {newFirstname, newLogin, newPassword, newAdress, newRole, currentUserID} = req.body;

    const {id} = req.user;
    try {
        const user = await UserController.getUserRole(id);
        if (user.role !== "admin") return res.status(403).send({message: "У вас нет прав на изменение данных"});
    } catch (err) {
        return res.status(400).json({message: "Ошибка => " + err.message})
    }

    try {
        if (newFirstname.length < 5 || newLogin.length < 5 || newPassword.length < 5 || newAdress.length < 5) return res.status(400).json({message: "Одно или несколько полей содержат 4 и меньше символов"})

        await UserController.changeUserData(newFirstname, newLogin, newPassword, newAdress, newRole, currentUserID);
    } catch (err) {
        return res.status(400).json({message: "Не правильные данные => " + err.message})
    }

    return res.json({message: "Данные изменены"});
}

exports.getUsers = async (req, res) => {
    try {
        const users = await UserController.getAllUsers();
        return res.json(users);
    } catch (err) {
        return res.status(500).json({message: "Внутренняя ошибка сервера"});
    }
}

exports.deleteUser = async (req, res) => {
    const {id} = req.user;
    try {
        const user = await UserController.getUserRole(id);
        if (user.role !== "admin") return res.status(403).send({message: "У вас нет прав на изменение данных"});
    } catch (err) {
        return res.status(400).json({message: "Ошибка => " + err.message})
    }

    try {
        const {deleteUserID} = req.body;
        await UserController.deleteUserByID(deleteUserID);
    } catch (err) {
        return res.status(400).json({message: "Ошибка удаления => " + err.message})
    }

    return res.json({message: "Пользователь удален"});
}

exports.admin = async (req, res) => {
    const {id} = req.user;

    try {
        const user = await UserController.getUserByID(id);
        if (user.role !== "admin") {
            return res.status(403).send({message: "У вас нет прав на просмотр"});
        }
        return res.send(user);
    } catch (err) {
        if (err.message === "Пользователь не найден") {
            return res.status(404).json({message: err.message});
        }
        return res.status(500).json({message: "Внутренняя ошибка сервера"});
    }
}

exports.getUserByID = async (req, res) => {
    try {
        const {currentUserID} = req.query;

        const curUser = await UserController.getUserByID(currentUserID);
        if (!curUser) return res.status(401).json({message: 'Не найден пользователь'});
        return res.json(curUser);
    } catch (err) {
        return res.status(500).json({message: 'Ошибка сервера при поиске пользователя'});
    }
}
