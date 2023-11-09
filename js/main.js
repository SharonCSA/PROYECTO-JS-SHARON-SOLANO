// Inicializa el carrito como un objeto vacío
const carrito = {
  productos: [],
  total: 0,
};

// Función para actualizar el contador del carrito
function actualizarContadorCarrito() {
  document.getElementById('cart-count').textContent = carrito.productos.length;
}

// Función para agregar un producto al carrito
function agregarProductoAlCarrito(nombre, precio) {
  const producto = {
    nombre: nombre,
    precio: precio,
  };
  carrito.productos.push(producto);
  carrito.total += precio;

  // Actualiza el contador del carrito
  actualizarContadorCarrito();
}

// Evento al hacer clic en el botón "Añadir al carrito"
const botonesComprar = document.querySelectorAll('.boton');
botonesComprar.forEach((boton) => {
  boton.addEventListener('click', (e) => {
    const productoNombre = e.target.getAttribute('data-product-name');
    const productoPrecio = parseFloat(e.target.getAttribute('data-product-price'));

    // Agregar el producto al carrito
    agregarProductoAlCarrito(productoNombre, productoPrecio);

    // Muestra una alerta indicando que se ha agregado al carrito
    Swal.fire('Producto Agregado', `Has agregado ${productoNombre} al carrito por $${productoPrecio}.`, 'success');
  });
});

// Función para abrir el carrito en una ventana emergente
function abrirCarrito() {
  let carritoHTML = '<ul>';
  for (const [index, producto] of carrito.productos.entries()) {
    carritoHTML += `<li>${producto.nombre} - $${producto.precio.toFixed(2)}`;
    carritoHTML += ` <button class="eliminar-producto" data-index="${index}">X</button></li>`;
  }
  carritoHTML += `</ul><p>Total: $${carrito.total.toFixed(2)}</p>`;

  Swal.fire({
    title: 'Carrito de Compras',
    html: carritoHTML,
    showCancelButton: true,
    showConfirmButton: false,  // Quitamos el botón de confirmación por ahora
  });

  // Agregamos un evento clic a los botones de eliminar producto
  const botonesEliminar = document.querySelectorAll('.eliminar-producto');
  botonesEliminar.forEach((boton) => {
    boton.addEventListener('click', (e) => {
      const index = parseInt(e.target.getAttribute('data-index'));
      eliminarProductoDelCarrito(index);
      abrirCarrito();  // Actualizamos la ventana del carrito
    });
  });
}

// Función para eliminar un producto del carrito
function eliminarProductoDelCarrito(index) {
  if (index >= 0 && index < carrito.productos.length) {
    const productoEliminado = carrito.productos.splice(index, 1)[0];
    carrito.total -= productoEliminado.precio;

    // Actualiza el contador del carrito
    actualizarContadorCarrito();
  }
}

// ...

// Evento al hacer clic en el botón del carrito en el header
const botonAbrirCarrito = document.getElementById('open-cart-button');
botonAbrirCarrito.addEventListener('click', () => {
  abrirCarrito();
});