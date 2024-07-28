const express = require("express");
const router = express.Router();
const CartManager = require("../controllers/cart-manager.js");
const cartManager = new CartManager("./src/data/carts.json");

router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.crearCarrito();
        res.json(nuevoCarrito);
    } catch (error) {
        res.status(500).send("No se pudo crear el carrito");
    }
})

router.get("/:cid", async (req, res) => {
    const carritoID = parseInt(req.params.cid);
    try {
        const carritoBuscado = await cartManager.getCartById(carritoID);
        res.json(carritoBuscado.products);
    } catch (error) {
        res.status(500).send("No se encuentra el carrito");
    }
})

router.post("/:cid/product/:pid", async (req, res) => {
    const carritoId = parseInt(req.params.cid);
    const productoId = req.params.pid;
    const quantity = req.body.quantity || 1;
    try {
        const carritoActualizado = await cartManager.addProductToCart(carritoId, productoId, quantity);
        res.json(carritoActualizado.products);
    } catch (error) {
        res.status(500).send("Error al ingresar un producto al carrito");
    }
})

module.exports = router; 