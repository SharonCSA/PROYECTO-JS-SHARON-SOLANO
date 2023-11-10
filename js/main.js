// Inicia el carrito como un objeto vacío
let carrito = {
  productos: [],
  total: 0
};

window.onload = function() {
  if (localStorage.getItem('carrito')) {
    const storedCarrito = JSON.parse(localStorage.getItem('carrito'));
    carrito.productos = storedCarrito.productos || [];
    carrito.total = storedCarrito.total || 0;
  }

  actualizarContadorCarrito();
}

let productos;

function addEventListenersToButtons() {
  document.querySelectorAll('.boton').forEach(button => {
    button.addEventListener('click', event => {
      const id = Number(event.target.getAttribute('data-product-id'));
      const nombre = event.target.getAttribute('data-product-name');
      const precio = Number(event.target.getAttribute('data-product-price'));
      agregarProductoAlCarrito(id, nombre, precio);
    });
  });
}

fetch('productos.json')
  .then(response => response.json())
  .then(data => {
    createProductContainers(data);
    addEventListenersToButtons();
  });

function createProductContainers(productos) {
  const catalogoContainer = document.getElementById('catalogo-container');
  const descuentosContainer = document.getElementById('descuentos-container');

  productos.forEach(product => {
      const productContainer = document.createElement('div');
      productContainer.className = 'col';
      productContainer.innerHTML = `
          <div class="${product.categoria} productos card">
              <img class="joyas" src="/assets/img/${product.imagen}" alt="${product.nombre}">
              <div class="card-body">
                  <p class="card-text">${product.nombre}</p>
                  <div class="d-flex justify-content-between align-items-center">
                      <div class="btn-group">
                          <button type="button" class="boton btn" data-product-id="${product.id}"
                              data-product-name="${product.nombre}"
                              data-product-price="${product.precio}">Añadir al carrito</button>
                      </div>
                      <small class="text-body-secondary">$${product.precio}</small>
                  </div>
              </div>
          </div>
      `;

      if (product.categoria === 'catalogo') {
          catalogoContainer.appendChild(productContainer);
      } else if (product.categoria === 'descuento') {
          descuentosContainer.appendChild(productContainer);
      }
  });
}

// Función para actualizar el contador del carrito
function actualizarContadorCarrito() {
  document.getElementById('cart-count').textContent = carrito.productos.length;
}

// Función para agregar un producto al carrito
function agregarProductoAlCarrito(id, nombre, precio) {
  const producto = {
    id: id,
    nombre: nombre,
    precio: precio,
  };
  carrito.productos.push(producto);
  carrito.total += precio;

  // Guarda el carrito en local localStorage
  localStorage.setItem('carrito', JSON.stringify(carrito));

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
  let carritoHTML = '<ul style="list-style-type: none; padding: 0;">';
  for (const [index, producto] of carrito.productos.entries()) {
    carritoHTML += `<li>${producto.nombre} - $${producto.precio.toFixed(2)}`;
    carritoHTML += ` <button class="eliminar-producto" data-index="${index}" style="background-color: red; color: white;">🗑️</button></li>`;
  }
  carritoHTML += `</ul><p style="font-size: 1.5em; color: green;">Total: $${carrito.total.toFixed(2)}</p>`;

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

    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Actualiza el contador del carrito
    actualizarContadorCarrito();
  }
}

const botonAbrirCarrito = document.getElementById('open-cart-button');
botonAbrirCarrito.addEventListener('click', () => {
  abrirCarrito();
}); 