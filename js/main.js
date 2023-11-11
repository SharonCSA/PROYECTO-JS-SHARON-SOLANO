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
};

let productos;

fetch('productos.json')
  .then(response => response.json())
  .then(data => {
    createProductContainers(data);
  });

function createProductContainers(productos) {
  const catalogoContainer = document.getElementById('catalogo-container');
  const descuentosContainer = document.getElementById('descuentos-container');

  productos.forEach(product => {
    const productContainer = document.createElement('div');
    productContainer.className = 'col';
    productContainer.innerHTML = `
      <div class="${product.categoria} productos card">
        <img class="joyas" src="./assets/img/${product.imagen}" alt="${product.nombre}">
        <div class="card-body">
          <p class="card-text">${product.nombre}</p>
          <div class="d-flex justify-content-between align-items-center">
            <div class="btn-group">
              <button type="button" class="boton" data-product-id="${product.id}"
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

// Agregar evento clic al botón "Añadir al carrito"
document.getElementById('catalogo-container').addEventListener('click', (event) => {
  const targetButton = event.target.closest('.boton');
  if (targetButton) {
    const id = Number(targetButton.getAttribute('data-product-id'));
    const nombre = targetButton.getAttribute('data-product-name');
    const precio = Number(targetButton.getAttribute('data-product-price'));
    agregarProductoAlCarrito(id, nombre, precio);

    // Muestra una alerta indicando que se ha agregado al carrito
    Swal.fire('Producto Agregado', `Has agregado ${nombre} al carrito por $${precio}.`, 'success');
  }
});

// Agregar evento clic al botón "Añadir al carrito"
document.getElementById('descuentos-container').addEventListener('click', (event) => {
  const targetButton = event.target.closest('.boton');
  if (targetButton) {
    const id = Number(targetButton.getAttribute('data-product-id'));
    const nombre = targetButton.getAttribute('data-product-name');
    const precio = Number(targetButton.getAttribute('data-product-price'));
    agregarProductoAlCarrito(id, nombre, precio);

    // Muestra una alerta indicando que se ha agregado al carrito
    Swal.fire('Producto Agregado', `Has agregado ${nombre} al carrito por $${precio}.`, 'success');
  }
});


// Función para eliminar un producto del carrito
function eliminarProductoDelCarrito(index) {
  const productoEliminado = carrito.productos.splice(index, 1)[0];
  carrito.total -= productoEliminado.precio;

  // Actualiza el carrito en local localStorage
  localStorage.setItem('carrito', JSON.stringify(carrito));

  // Actualiza el contador del carrito
  actualizarContadorCarrito();
}

// Función para abrir el carrito en una ventana emergente
function abrirCarrito() {
  let carritoHTML = '<ol style="list-style-type: none; padding: 0;">';

  carrito.productos.forEach((producto, index) => {
    carritoHTML += `<li>${producto.nombre} - $${producto.precio.toFixed(2)}`;
    carritoHTML += ` <button class="eliminar-producto" data-index="${index}" style="background-color: red; color: white;">🗑️</button></li>`;
  });

  carritoHTML += `</ol><p style="font-size: 1.5rem; color: black;">Total: $${carrito.total.toFixed(2)}</p>`;

  const botonesHTML = `
    <button id="realizar-compra-boton" class="boton">Realizar Compra</button>
    <button id="vaciar-carrito-boton" class="boton">Vaciar Carrito</button>
    <button id="volver-boton" class="boton">Volver</button>
  `;

  Swal.fire({
    title: 'Carrito de Compras',
    html: carritoHTML,
    showCancelButton: false,
    showConfirmButton: false,
    showCloseButton: true, // Mostramos el botón de cerrar
    footer: botonesHTML, // Agregamos los botones en el pie de página
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

  // Evento clic en el botón "Realizar Compra"
  document.getElementById('realizar-compra-boton').addEventListener('click', () => {
    realizarCompra();
  });

  // Evento clic en el botón "Vaciar Carrito"
  document.getElementById('vaciar-carrito-boton').addEventListener('click', () => {
    vaciarCarrito();
  });

  // Evento clic en el botón "Volver"
  document.getElementById('volver-boton').addEventListener('click', () => {
    Swal.close(); // Cerrar la ventana del carrito
  });
}


// Función para realizar la compra
function realizarCompra() {
  // Mostrar ventana emergente con formulario de datos de pago
  Swal.fire({
    title: 'Datos de Pago',
    html: `
      <form id="datos-pago-form">
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" name="nombre" required><br>
        
        <label for="apellido">Apellido:</label>
        <input type="text" id="apellido" name="apellido" required><br>

        <label for="tarjeta">Número de Tarjeta:</label>
        <input type="text" id="tarjeta" name="tarjeta" required><br>

        <label for="vencimiento">Vencimiento de la tarjeta:</label>
        <input type="text" id="vencimiento" name="vencimiento" required><br>

        <label for="codigo">Código de seguridad:</label>
        <input type="text" id="codigo" name="codigo" required><br>

        <label for="correo">Correo Electrónico:</label>
        <input type="email" id="correo" name="correo" required><br>

        <label for="monto">Monto Total:</label>
        <input type="text" id="monto" name="monto" value="$${carrito.total.toFixed(2)}" readonly><br>

        <button type="submit" class="boton">Realizar Compra</button>
      </form>
    `,
    showCloseButton: true,
    showConfirmButton: false,
  });

  // Agregar evento de submit al formulario
  document.getElementById('datos-pago-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // Obtener los valores del formulario
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const tarjeta = document.getElementById('tarjeta').value;
    const correo = document.getElementById('correo').value;

    // Cerrar la ventana de datos de pago
    Swal.close();

    // Mostrar alerta de compra realizada con éxito
    Swal.fire({
      title: 'Compra Realizada',
      text: `¡Gracias por tu compra, ${nombre} ${apellido}!\nSe ha realizado con éxito.\nTotal: $${carrito.total.toFixed(2)}`,
      icon: 'success',
      showCloseButton: true,
    });

    // Reiniciar el carrito y actualizar contador
    carrito = {
      productos: [],
      total: 0
    };
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
  });
}


// Función para vaciar el carrito
function vaciarCarrito() {
  // Mostrar confirmación antes de vaciar el carrito
  Swal.fire({
    title: 'Vaciar Carrito',
    text: '¿Estás seguro de que deseas vaciar tu carrito?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, vaciar carrito'
  }).then((result) => {
    if (result.isConfirmed) {
      // Vaciar el carrito y actualizar contador
      carrito = {
        productos: [],
        total: 0
      };
      localStorage.setItem('carrito', JSON.stringify(carrito));
      actualizarContadorCarrito();

      // Mostrar alerta de carrito vaciado
      Swal.fire('Carrito Vacío', 'Tu carrito ha sido vaciado con éxito.', 'success');

      // Cerrar la ventana del carrito
      Swal.close();
    }
  });
}

const botonAbrirCarrito = document.getElementById('open-cart-button');
botonAbrirCarrito.addEventListener('click', () => {
  abrirCarrito();
});

// Formulario de contacto
const formularioContacto = `
  <div class="borde_form card">
    <div class="titulo_form card-header">
      <h2 class="text-center text-black">¡Ponte en contacto con nosotros!</h2>
    </div>
    <div class="bg-body-secondary card-body">
      <form id="contactForm">
        <div class="form-group">
          <label for="nombre">Nombre</label>
          <input type="text" class="form-control" id="nombre" placeholder="Escriba su nombre">
        </div>
        <div class="form-group">
          <label for="apellido">Apellido</label>
          <input type="text" class="form-control" id="apellido" placeholder="Escriba su apellido">
        </div>
        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input type="email" required="" class="form-control" id="email" placeholder="example@gmail.com">
        </div>
        <div class="form-group">
          <label for="telefono">Número de Contacto</label>
          <input type="tel" required="" class="form-control" id="telefono" placeholder="Escriba su número para contactarnos con usted">
        </div>
        <div class="form-group">
          <label for="compra">Cuéntanos acerca de tu cotización</label>
          <textarea class="form-control" id="compra" rows="5" placeholder="Escriba lo que desea comprar o cotizar"></textarea>
        </div>
        Espera nuestra respuesta en lapso de 24hrs.
        <div class="text-center">
          <button type="button" class="btn boton" onclick="enviarFormulario()">Enviar</button>
          <button type="reset" class="btn btn-secondary">Borrar</button>
        </div>
      </form>
    </div>
  </div>
`;

// Evento al hacer clic en el enlace del contenedor para mostrar el formulario
document.querySelector('#cotizar a').addEventListener('click', () => {
  Swal.fire({
    title: 'Cotización',
    html: formularioContacto,
    showCloseButton: true,
    showConfirmButton: false
  });
});

// Función para enviar el formulario al servidor
function enviarFormulario() {
  const nombre = document.getElementById('nombre').value;
  const apellido = document.getElementById('apellido').value;
  const email = document.getElementById('email').value;
  const telefono = document.getElementById('telefono').value;
  const compra = document.getElementById('compra').value;

  // Crear un objeto con los datos del formulario
  const datosFormulario = {
    nombre,
    apellido,
    email,
    telefono,
    compra
  };

  // Enviar la información al servidor
  fetch('https://', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datosFormulario),
  })
  .then(response => response.json())
  .then(data => {
    // Se pudiera manejar la respuesta del servidor si es necesario, pero dará un error itencional al enviar porque no hay un servidor linkeado
    console.log('Respuesta del servidor:', data);
    Swal.fire('¡Enviado!', 'Tu formulario ha sido enviado correctamente.', 'success');
  })
  .catch((error) => {
    console.error('Error al enviar el formulario:', error);
    Swal.fire('Error', 'Hubo un problema al enviar el formulario. Inténtalo de nuevo más tarde.', 'error');
  });
}

