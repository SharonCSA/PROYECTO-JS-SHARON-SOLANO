const nombreApellidoInput = document.getElementById("nombreApellido");
const nombreProductoInput = document.getElementById("nombreProducto");
const precioProductoInput = document.getElementById("precioProducto");
const listaProductos = document.getElementById("listaProductos");
const totalCompra = document.getElementById("totalCompra");
const medioPagoSelect = document.getElementById("medioPago");
const agregarProductoButton = document.getElementById("agregarProducto");
const realizarCompraButton = document.getElementById("realizarCompra");
const mensajeCompra = document.getElementById("mensajeCompra");

// Array productos
let productos = [];

// Verifica si hay datos guardados en Local Storage y los carga
if (localStorage.getItem("productos")) {
    productos = JSON.parse(localStorage.getItem("productos"));
    actualizarListaProductos();
    actualizarTotalCompra();
}

// Agrega productos al hacer clic en el botón "Agregar Producto"
agregarProductoButton.addEventListener("click", function() {
    // Obtiene los datos del producto
    const nombreProducto = nombreProductoInput.value;
    const precioProducto = parseFloat(precioProductoInput.value);

    if (nombreProducto && !isNaN(precioProducto) && precioProducto > 0) {
        // Agrega el producto al array
        productos.push({ nombre: nombreProducto, precio: precioProducto });

        // Guarda los productos en Local Storage
        localStorage.setItem("productos", JSON.stringify(productos));

        // Actualiza la lista de productos y el total de la compra
        actualizarListaProductos();
        actualizarTotalCompra();
    } else {
        alert("Por favor, ingresa un nombre de producto y un valor numérico válido para el precio.");
    }

    // Limpia los campos de entrada
    nombreProductoInput.value = "";
    precioProductoInput.value = "";
});

// Actualiza la lista de productos en la página
function actualizarListaProductos() {
    listaProductos.innerHTML = "";
    for (const producto of productos) {
        const listItem = document.createElement("li");
        listItem.textContent = `${producto.nombre} - $${producto.precio.toFixed(2)}`;
        listaProductos.appendChild(listItem);
    }
}

// Actualiza el total de la compra
function actualizarTotalCompra() {
    let total = 0;
    for (const producto of productos) {
        total += producto.precio;
    }
    totalCompra.textContent = total.toFixed(2);
}

// Se realiza la compra al hacer clic en el botón "Realizar Compra"
realizarCompraButton.addEventListener("click", function() {
    const medioPago = medioPagoSelect.value;
    const nombreUsuario = nombreApellidoInput.value;

    let mensaje = "";

    if (medioPago === 'efectivo') {
        const descuento = parseFloat(totalCompra.textContent) * 0.10;
        const totalConDescuento = parseFloat(totalCompra.textContent) - descuento;
        mensaje = `¡Enhorabuena ${nombreUsuario} por pagar en efectivo! Obtienes un 10% de descuento. Tu total con descuento es: $${totalConDescuento.toFixed(2)}`;
    } else if (medioPago === 'tarjeta') {
        mensaje = `¡Enhorabuena, ${nombreUsuario}, tu compra ha sido realizada!. Tu total es: $${totalCompra.textContent}`;
    } else {
        mensaje = `Medio de pago no reconocido. Tu total es: $${totalCompra.textContent}`;
    }

    // Mostrar el mensaje en el elemento con id "mensajeCompra"
    mensajeCompra.textContent = mensaje;
});

