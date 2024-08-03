const expess = require("express");
const router = expess.Router();
const ProductManager = require("../controllers/product-manager.js");
const manager = new ProductManager("./src/data/products.json");

router.get("/products", async(req, res) => {
    const productos = await manager.getProducts();
    res.render("home", {productos});
})

// uso socket para mostrar en tiempo real con formulario para agregar producto y boton para eliminar
router.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts");
})

module.exports = router;
