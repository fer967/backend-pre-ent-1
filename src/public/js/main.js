const socketClient = io();

socketClient.on("envioDeProductos", (productos) => {
    updateProductsList(productos);
})

function updateProductsList(productos) {
    const productsDiv = document.getElementById("list-product")
    let productosHTML = "";
    productos.forEach((product) => {
        productosHTML += `<div class="card-body">
        <div class="">
            <h4>${product.title}</h4>
            <p>id: ${product.id}</p>
            <p>description:${product.description}</p>
            <p>precio:${product.price}</p>
            <p>code:${product.code}</p>
            <p>stock:${product.stock}</p>
        </div>
        <div>
            <button type="button" class="button" onClick="deleteProduct(${product.id})">eliminar</button>
        </div>
        </div>`;
    })
    productsDiv.innerHTML = productosHTML;
}

let form = document.getElementById("formProduct");
form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    let title = form.elements.title.value;
    let description = form.elements.description.value;
    let price = form.elements.price.value;
    let code = form.elements.code.value;
    let stock = form.elements.stock.value;
socketClient.emit("addProduct", {title, description, price, code, stock});
form.reset();
})

// elimino x id
document.getElementById("delete-btn").addEventListener("click", function(){
    const deleteIdInput = document.getElementById("id-prod");
    const deleteId = parseInt(deleteIdInput.value);
    socketClient.emit("deleteProduct", deleteId);
    deleteIdInput.value = "";
})

// elimino directamente
function deleteProduct(id){
    socketClient.emit("deleteProduct", id );
}  
