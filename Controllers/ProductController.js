const {
    getAllProducts,
    getProductById,
    updateProduct,
    createProduct,
    deleteProduct
} = require('../bd/ProductController');

exports.getProducts = async (req, res) => {
    const products = await getAllProducts();

    if (!products) return res.status(400).json({"message": "Не удалось получить продукты"})

    return res.json(products);
}

exports.getOneProduct = async (req, res) => {
    try {
        const product = await getProductById(req.params.id)
        return res.json(product);
    } catch (err) {
        return res.status(404).json({"message": err.message});
    }
}

exports.updateProductData = async (req, res) => {
    try {
        const {productID, name, category, price, stock, description} = req.body;

        const countOfUpdatedProducts = await updateProduct(name, category, price, stock, description, productID);
        return res.json(countOfUpdatedProducts);
    } catch (err) {
        return res.status(500).json({"message": err.message})
    }
}

exports.createProduct = async (req, res) => {
    try {
        const {name, category, price, stock, description} = req.body;

        const countOfCreatedProducts = await createProduct(name, category, price, stock, description);
        return res.json(countOfCreatedProducts);
    } catch (err) {
        return res.status(500).json({"message": err.message})
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const {productID} = req.query;

        const countOfDeletedProducts = await deleteProduct(productID);
        return res.json(countOfDeletedProducts);
    } catch (err) {
        return res.status(500).json({"message": err.message})
    }
}

