function obtenerValorProducto() {
    let valorProducto = parseFloat(prompt("¿Cuál es el precio del producto que deseas comprar?"));
    if (!isNaN(valorProducto) && valorProducto > 0) {
      return valorProducto;
    } else {
      alert("Por favor, ingresa un valor numérico válido para el producto.");
      return obtenerValorProducto(); 
    }
  }
  function calcularTotalCompra() {
    var totalCompra = 0;
    while (true) {
      let valorProducto = obtenerValorProducto();
      totalCompra += valorProducto;
      let deseaAgregarMas = prompt("¿Deseas añadir otro producto a tu compra? (Escribe 'si' o 'no')").toLowerCase();
      if (deseaAgregarMas !== 'si') {
        break;
      }
    }
    return totalCompra;
  }
  
  let nombre = prompt("Hola, escribe aquí tu nombre y apellido:");
  alert("¡Hola, " + nombre + "! Bienvenido a nuestra tienda virtual.✨");
  
  let totalCompra = calcularTotalCompra();
  
  alert("El total de tu compra es: $" + totalCompra);
  alert("Tu compra ha sido realizada. ¡Gracias por visitarnos, te esperamos nuevamente! 🤗");
  
