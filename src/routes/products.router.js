const express = require("express");
const ProductManager = require("../controllers/product-manager.js");
const manager = new ProductManager("./src/data/products.json");
const router = express.Router();

// obtengo todos los productos ( puedo usar limite)
router.get("/", async (req, res) => {
    const limit = req.query.limit;
    try {
        const arrayProductos = await manager.getProducts();
        if (limit) {
            res.send(arrayProductos.slice(0, limit));
        } else {
            res.send(arrayProductos);
        }
    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
})


//Busco un producto por id 
router.get("/:pid", async (req, res) => {
    let id = req.params.pid;
    try {
        const producto = await manager.getProductById(parseInt(id));
        if (!producto) {
            res.send("Producto no encontrado");
        } else {
            res.send(producto);
        }
    } catch (error) {
        res.send("Error al buscar ese id en los productos");
    }
})


//Agrego un producto nuevo
router.post("/", async (req, res) => {
    const newProduct = req.body;
    try {
        await manager.addProduct(newProduct); 
        res.status(201).send("Producto agregado exitosamente"); 
    } catch (error) {
        res.status(500).json({status: "error", message: error.message});
    }
})

// Elimino un producto por id
router.delete("/:pid", async(req, res) => {
    let id = req.params.pid;
    const deletedProd = await manager.deleteProduct(parseInt(id));
    if(! deletedProd){
        res.status(404).send({message:"error", error:"producto no encontrado"});
    } else{
        res.status(200).send(`se elimino ${deletedProd.title} correctamente`);
    }
})


module.exports = router; 