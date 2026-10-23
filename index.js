require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT;
const cors = require('cors');
const AuthController = require("./Controllers/AuthController");
const MiddleAuth = require("./MiddleWares/MiddleAuth");
const AdminChecker = require("./Middlewares/AdminChecker");
const {
    getOrdersByUserID,
    getProductsByOrderID,
    makeOrder,
    payOrder,
    getAllOrders,
    getOrderInfo,
    deleteOrder,
    changeOrderStatus
} = require('./Controllers/OrderController');
const {
    getProducts,
    getOneProduct,
    updateProductData,
    createProduct,
    deleteProduct
} = require('./Controllers/ProductController');

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.post('/login', AuthController.login);
app.post('/register', AuthController.register)
app.get('/me', MiddleAuth, AuthController.getMe);
app.post('/changeUserData', MiddleAuth, AuthController.changeUserData);
app.post('/changeUserDataAdmin', MiddleAuth, AuthController.changeUserDataAdmin);
app.get('/admin', MiddleAuth, AuthController.admin);
app.get('/getUsers', MiddleAuth, AuthController.getUsers);
app.post('/delUser', MiddleAuth, AuthController.deleteUser);
app.get('/getUserByID', MiddleAuth, AdminChecker, AuthController.getUserByID);

app.get('/getOrders', MiddleAuth, getOrdersByUserID);
app.get('/getAllOrders', MiddleAuth, AdminChecker, getAllOrders);
app.get('/getOrderInfo', MiddleAuth, AdminChecker, getOrderInfo);
app.post('/makeOrder', MiddleAuth, makeOrder);
app.post('/updateOrderStatus', MiddleAuth, payOrder);
app.delete('/deleteOrder', MiddleAuth, AdminChecker, deleteOrder);
app.patch('/changeOrderStatus', MiddleAuth, AdminChecker, changeOrderStatus);

app.get('/getProductsByOrder/:id', MiddleAuth, getProductsByOrderID);
app.get('/getProducts', getProducts);
app.get('/getProduct/:id', getOneProduct);
app.put('/updateProduct', MiddleAuth, AdminChecker, updateProductData);
app.post('/createProduct', MiddleAuth, AdminChecker, createProduct);
app.delete('/deleteProduct', MiddleAuth, AdminChecker, deleteProduct);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
