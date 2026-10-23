const {
    getOrdersByUserID,
    getProductsByOrderID,
    CreateOrder,
    CreateOrderItem,
    changeStatus,
    getAllOrders,
    getOrderInfo,
    deleteOrder,
    changeOrderStatus
} = require('../bd/OrderService');
const err = require("jsonwebtoken/lib/JsonWebTokenError");
const {updateCountOfProduct} = require("../bd/ProductController");

exports.getOrdersByUserID = async (req, res) => {
    if (!req.user) return res.status(401).json({message: 'Не авторизован'});
    const {id} = req.user;

    const orders = await getOrdersByUserID(id);

    return res.json(orders);
}

exports.getProductsByOrderID = async (req, res) => {

    const products = await getProductsByOrderID(req.params.id);

    return res.json(products);
}

exports.makeOrder = async (req, res) => {
    if (!req.user) return res.status(401).json({message: 'Не авторизован'});
    const {id} = req.user;
    const orderedProducts = req.body;

    const order = await CreateOrder(id);
    if (!order) return res.status(400).json({"message": "Не удалось оформить заказ"});

    const createdOrder = await CreateOrderItem(order, orderedProducts).catch(err => {
        return res.status(500).json({message: err})
    });

    orderedProducts.map(item => updateCountOfProduct(item));

    return res.status(201).json({id: createdOrder, message: `Успешный заказ`});
}

exports.payOrder = async (req, res) => {
    if (!req.user) return res.status(401).json({message: 'Не авторизован'});
    const {id} = req.user;
    if (!req.body) return res.status(404).json({message: 'Заказ не найден'});
    const {orderID} = req.body;

    const countChanged = await changeStatus("paid", orderID, id);
    if (countChanged === 0) return res.status(401).json({"message": "У вас нет доступа к этому заказу"});

    return res.json({message: "Статус успешно изменен"});
}

exports.getAllOrders = async (req, res) => {
    try {
        const allOrders = await getAllOrders();

        return res.json(allOrders);
    } catch (err) {
        return res.status(500).json({"message": err.message})
    }
}

exports.getOrderInfo = async (req, res) => {
    try {
        const {currentOrder} = req.query;
        const allOrderInfo = await getOrderInfo(currentOrder);

        return res.json(allOrderInfo);
    } catch (err) {
        return res.status(500).json({"message": err.message})
    }
}

exports.deleteOrder = async (req, res) => {
    try {
        const {orderID} = req.query;

        const deletedRows = await deleteOrder(orderID);

        return res.json({deletedRows});
    } catch (err) {
        return res.status(500).json({"message": err.message})
    }
}

exports.changeOrderStatus = async (req, res) => {
    try {
        const {orderID, newStatus} = req.body;

        const updatedRows = await changeOrderStatus(orderID, newStatus);

        return res.json({updatedRows});
    } catch (err) {
        return res.status(500).json({"message": err.message})
    }
}
