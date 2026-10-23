const AuthController = require("../Controllers/AuthController");
const UserController = require("../bd/UserController");

module.exports = async (req, res, next) => {
    try {
        const { id } = req.user;

        const user = await UserController.getUserByID(id);
        if (user.role !== "admin") {
            return res.status(403).send({message: "У вас нет прав на просмотр"});
        }
        next();
    } catch (err) {
        if (err.message === "Пользователь не найден") {
            return res.status(404).json({message: err.message});
        }
        return res.status(500).json({message: "Внутренняя ошибка сервера"});
    }
}
