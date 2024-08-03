
const ProductManager = require("./controllers/product-manager.js");
const manager = new ProductManager("./src/data/products.json");
const express = require("express");
const productRouter = require("./routes/products.router.js");
const cartRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const exphbs = require("express-handlebars");
const app = express();
const PUERTO = 8080;
const socket = require("socket.io");

//Middleware: 
app.use(express.json());
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Rutas
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);
app.use("/", express.static("./src/public"));

const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en el http://localhost:${PUERTO}`);
})

// crear instancia para trabajar con websockets lado SERVIDOR
const io = socket(httpServer);

// crear conexion (escucha al cliente)
io.on("connection", async (socket) => {
    const productos = await manager.getProducts();
    io.emit("envioDeProductos", productos)
    socket.on("addProduct", async (obj) => {
        await manager.addProduct(obj)
        const productos = await manager.getProducts()
        io.emit("envioDeProductos", productos)
    })
    socket.on("deleteProduct", async (id) => {
        console.log(id);
        await manager.deleteProduct(id)
        const productos = await manager.getProducts()
        io.emit("envioDeProductos", productos)
    })
});
