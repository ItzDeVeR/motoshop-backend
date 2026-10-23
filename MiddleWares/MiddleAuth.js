var jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) return res.status(401).json({ message: 'Не авторизован' });

        const decoded = jwt.verify(token, process.env.SECRET);

        req.user = decoded;

        next();
    } catch (e) {
        return res.status(401).json({ message: 'Не авторизован' });
    }
}
