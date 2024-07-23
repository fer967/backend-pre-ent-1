const fs = require("fs").promises;

class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = [];
        this.ultId = 0;
        this.cargarCarritos();
    }

    async cargarCarritos() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            this.carts = JSON.parse(data);
            if (this.carts.length > 0) {
                this.ultId = Math.max(...this.carts.map(cart => cart.id));
            }
        } catch (error) {
            console.log("Error al cargar el carrito");
            await this.guardarCarritos();
        }
    }

    async guardarCarritos() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }

    async crearCarrito() {
        const nuevoCarrito = {
            id: ++this.ultId,
            products: []
        };
        this.carts.push(nuevoCarrito);
        await this.guardarCarritos();
        return nuevoCarrito;
    }

    async getCartById(carritoId) {
        try {
            const carritoBuscado = this.carts.find(carrito => carrito.id === carritoId);
            if (!carritoBuscado) {
                throw new Error("No existe un carrito con ese id");
            }
            return carritoBuscado;
        } catch (error) {
            console.log("No se encontro el carrito");
            throw error;
        }
    }

    async addProductToCart(carritoId, productoId, quantity = 1) {
        const carrito = await this.getCartById(carritoId);
        const existeProducto = carrito.products.find(p => p.product === productoId);
        if (existeProducto) {
            existeProducto.quantity += quantity;
        } else {
            carrito.products.push({ product: productoId, quantity });
        }
        await this.guardarCarritos();
        return carrito;
    }

}

module.exports = CartManager; 