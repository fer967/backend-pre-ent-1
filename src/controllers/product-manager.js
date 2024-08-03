
const fs = require("fs").promises;

class ProductManager {

    static ultId = 0;

    constructor(path) {
        this.products = [];
        this.path = path;
    }

    async addProduct({ title, description, price, code, stock}) {
        const arrayProductos = await this.leerArchivo();
        if (!title || !description || !price || !code || !stock) {
            console.log("Todos los campos son obligatorios");
            return;
        }
        if (this.products.some(item => item.code === code)) {
            console.log("El codigo debe ser unico");
            return;
        }
        const nuevoProducto = {
            title,
            description,
            price,
            code,
            stock,
        }
        if (arrayProductos.length > 0) {
            ProductManager.ultId = arrayProductos.reduce((maxId, product) => Math.max(maxId, product.id), 0);
        }
        nuevoProducto.id = ++ProductManager.ultId;
        arrayProductos.push(nuevoProducto);
        await this.guardarArchivo(arrayProductos);
    }

    async getProducts() {
        const arrayProductos = await this.leerArchivo();
        return arrayProductos;
    }

    async getProductById(id) {
        const arrayProductos = await this.leerArchivo();
        const buscado = arrayProductos.find(item => item.id === id);
        if (!buscado) {
            return "Producto no encontrado";
        } else {
            return buscado;
        }
    }

    async updateProduct(id, {...data }){
        const response = await this.leerArchivo();
        const index = response.findIndex(prod => prod.id == id);
        if (index != -1) {
            response[index] = { id, ...data };
            await this.guardarArchivo(response);
            return response[index]
        } else {
            console.log("producto no encontrado");
        }
    }

    async deleteProduct(id) {
        const arrayProductos = await this.leerArchivo();
        const indexProd = arrayProductos.findIndex(item => item.id === id);
        const deletedProd = await this.getProductById(id);
        if (indexProd != -1) {
            arrayProductos.splice(indexProd, 1);
            console.log(`se elimino ${deletedProd.title}`);
            await this.guardarArchivo(arrayProductos);
            return deletedProd;
        } else {
            return "Producto no encontrado";
        }
    }

    async leerArchivo() {
        const respuesta = await fs.readFile(this.path, "utf-8");
        const arrayProductos = JSON.parse(respuesta);
        return arrayProductos;
    }

    async guardarArchivo(arrayProductos) {
        await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
    }

}

module.exports = ProductManager;



























// EJEMPLO PROFE
/*
    async updateProduct(id, productoActualizado) {
        try {
            const arrayProductos = await this.leerArchivo(); 
            const index = arrayProductos.findIndex( item => item.id === id); 
            if(index !== -1) {
                arrayProductos[index] = {...arrayProductos[index], ...productoActualizado} ; 
                await this.guardarArchivo(arrayProductos); 
                console.log("Producto actualizado"); 
            } else {
                console.log("No se encuentra el producto"); 
            }
        } catch (error) {
            console.log("Tenemos un error al actualizar productos"); 
        }
    } */









