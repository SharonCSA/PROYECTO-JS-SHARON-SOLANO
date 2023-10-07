function obtenerValorProducto() {
  let valorProducto = parseFloat(prompt("¿Cuál es el precio del producto que deseas comprar?"));
  if (!isNaN(valorProducto) && valorProducto > 0) {
    return valorProducto;
  } else {
    alert("Por favor, ingresa un valor numérico válido para el producto.");
    return obtenerValorProducto();
  }
}

function calcularTotalCompra(productos) {
  let totalCompra = 0;
  for (let i = 0; i < productos.length; i++) {
    totalCompra += productos[i].precio;
  }
  return totalCompra;
}

let nombre = prompt("Hola, para continuar escribe aquí tu nombre y apellido:");
alert("¡Hola, " + nombre + "! Bienvenido a nuestra tienda virtual.✨");

let productos = []; // Array

while (true) {
  let nombreProducto = prompt("¿Cuál es el nombre del producto?");
  let precioProducto = obtenerValorProducto();

  productos.push({ nombre: nombreProducto, precio: precioProducto });

  let deseaAgregarMas = prompt("¿Deseas añadir otro producto a tu compra? (Escribe 'si' o 'no')").toLowerCase();

  if (deseaAgregarMas !== 'si') {
    break;
  }
}

let totalCompra = calcularTotalCompra(productos);

alert("Tus productos seleccionados son:");

for (let i = 0; i < productos.length; i++) {
  alert(productos[i].nombre + " - $" + productos[i].precio.toFixed(2));
}

let medioDePago = prompt("¿Cuál será tu medio de pago? (Escribe 'efectivo' o 'tarjeta')").toLowerCase();

if (medioDePago === 'efectivo') {
  let descuento = totalCompra * 0.10; // Descuento de 10% para compra en efectivo
  totalCompra -= descuento; // Resta el descuento al total
  alert("¡Enhorabuena por pagar en efectivo! Obtienes un 10% de descuento. Tu total con descuento es: $" + totalCompra.toFixed(2));
} else if (medioDePago === 'tarjeta') {
  alert("No obtienes ningún descuento. Tu total es: $" + totalCompra.toFixed(2));
} else {
  alert("Medio de pago no reconocido. Tu total es: $" + totalCompra.toFixed(2));
}

alert("Tu compra ha sido realizada. ¡Gracias por visitarnos, te esperamos nuevamente! 🤗");

