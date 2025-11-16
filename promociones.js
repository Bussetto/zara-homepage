function calcularPromocion() {
    // Obtener tipo de promoción seleccionada
    const promoType = document.querySelector('input[name="promoType"]:checked').value;
    
    // Obtener todos los productos
    const productos = obtenerProductos();
    
    // Validar que haya al menos un producto
    if (productos.length === 0) {
        mostrarError('Por favor, ingresá al menos un producto con precio y cantidad');
        return;
    }
    
    // Calcular según el tipo de promoción
    let resultado;
    switch(promoType) {
        case '1':
            resultado = calcularPromo50Segundo(productos);
            break;
        case '2':
            resultado = calcularPromo3x2(productos);
            break;
        case '3':
            resultado = calcularPromo10Porcentaje(productos);
            break;
        default:
            mostrarError('Seleccioná una promoción válida');
            return;
    }
    
    // Mostrar resultados
    mostrarResultados(resultado);
}

// ========== OBTENER PRODUCTOS DEL FORMULARIO ==========
function obtenerProductos() {
    const productosItems = document.querySelectorAll('.producto-item');
    const productos = [];
    
    productosItems.forEach((item, index) => {
        const precio = parseFloat(item.querySelector('.producto-precio').value);
        const cantidad = parseInt(item.querySelector('.producto-cantidad').value) || 1;
        
        if (precio && precio > 0) {
            productos.push({
                numero: index + 1,
                precio: precio,
                cantidad: cantidad,
                subtotal: precio * cantidad
            });
        }
    });
    
    return productos;
}

// ========== PROMOCIÓN 1: 50% EN EL SEGUNDO ==========
function calcularPromo50Segundo(productos) {
    if (productos.length < 2) {
        return {
            error: true,
            mensaje: 'Necesitás al menos 2 productos para esta promoción'
        };
    }
    
    // Calcular subtotal
    let subtotal = 0;
    productos.forEach(p => {
        subtotal += p.subtotal;
    });
    
    // Encontrar el producto de menor valor
    let menorValor = productos[0].precio;
    productos.forEach(p => {
        if (p.precio < menorValor) {
            menorValor = p.precio;
        }
    });
    
    // Calcular descuento (50% del producto más barato)
    const descuento = menorValor * 0.5;
    const total = subtotal - descuento;
    
    return {
        subtotal: subtotal,
        descuento: descuento,
        total: total,
        mensaje: `¡Ahorraste $${formatearPrecio(descuento)} con el 50% en el segundo producto!`,
        productos: productos
    };
}

// ========== PROMOCIÓN 2: 3X2 ==========
function calcularPromo3x2(productos) {
    if (productos.length < 3) {
        return {
            error: true,
            mensaje: 'Necesitás al menos 3 productos para esta promoción'
        };
    }
    
    // Calcular subtotal
    let subtotal = 0;
    productos.forEach(p => {
        subtotal += p.subtotal;
    });
    
    // Encontrar el producto de menor valor
    let menorValor = productos[0].precio;
    productos.forEach(p => {
        if (p.precio < menorValor) {
            menorValor = p.precio;
        }
    });
    
    // El producto más barato sale GRATIS
    const descuento = menorValor;
    const total = subtotal - descuento;
    
    return {
        subtotal: subtotal,
        descuento: descuento,
        total: total,
        mensaje: `¡Ahorraste $${formatearPrecio(descuento)}! El producto de menor valor es GRATIS 🎁`,
        productos: productos
    };
}

// ========== PROMOCIÓN 3: 10% EN COMPRAS MAYORES ==========
function calcularPromo10Porcentaje(productos) {
    // Calcular subtotal
    let subtotal = 0;
    productos.forEach(p => {
        subtotal += p.subtotal;
    });
    
    // Verificar si supera los $30.000
    if (subtotal < 30000) {
        return {
            error: true,
            mensaje: `Tu compra es de $${formatearPrecio(subtotal)}. Necesitás superar $30.000 para esta promoción. ¡Te faltan $${formatearPrecio(30000 - subtotal)}!`
        };
    }
    
    // Calcular 10% de descuento
    const descuento = subtotal * 0.1;
    const total = subtotal - descuento;
    
    return {
        subtotal: subtotal,
        descuento: descuento,
        total: total,
        mensaje: `¡Ahorraste $${formatearPrecio(descuento)} con el 10% de descuento! 🎉`,
        productos: productos
    };
}

// ========== MOSTRAR RESULTADOS ==========
function mostrarResultados(resultado) {
    const resultadosDiv = document.getElementById('resultados');
    
    if (resultado.error) {
        mostrarError(resultado.mensaje);
        resultadosDiv.style.display = 'none';
        return;
    }
    
    // Actualizar valores
    document.getElementById('subtotal').textContent = `$${formatearPrecio(resultado.subtotal)}`;
    document.getElementById('descuento').textContent = `-$${formatearPrecio(resultado.descuento)}`;
    document.getElementById('total').textContent = `$${formatearPrecio(resultado.total)}`;
    document.getElementById('mensajeAhorro').textContent = resultado.mensaje;
    
    // Mostrar resultados con animación
    resultadosDiv.style.display = 'block';
    resultadosDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ========== MOSTRAR ERROR ==========
function mostrarError(mensaje) {
    alert(`⚠️ ${mensaje}`);
}

// ========== FORMATEAR PRECIO ==========
function formatearPrecio(numero) {
    return numero.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// ========== ACTIVAR PROMOCIÓN DESDE BOTONES ==========
function activarPromo(numero) {
    // Seleccionar el radio button correspondiente
    document.getElementById(`promo${numero}`).checked = true;
    
    // Scroll suave a la calculadora
    document.querySelector('.calculadora').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
    
    // Efecto visual en el botón seleccionado
    const labels = document.querySelectorAll('.btn-group label');
    labels.forEach(label => label.classList.remove('active'));
    document.querySelector(`label[for="promo${numero}"]`).classList.add('active');
}

// ========== LIMPIAR CALCULADORA ==========
function limpiarCalculadora() {
    // Limpiar inputs
    document.querySelectorAll('.producto-precio').forEach(input => input.value = '');
    document.querySelectorAll('.producto-cantidad').forEach(input => input.value = '1');
    
    // Ocultar resultados
    document.getElementById('resultados').style.display = 'none';
    
    // Seleccionar primera promoción
    document.getElementById('promo1').checked = true;
    
    console.log('✅ Calculadora reiniciada');
}

// ========== VALIDACIÓN EN TIEMPO REAL ==========
document.addEventListener('DOMContentLoaded', function() {
    // Solo permitir números positivos
    document.querySelectorAll('.producto-precio, .producto-cantidad').forEach(input => {
        input.addEventListener('input', function() {
            if (this.value < 0) {
                this.value = 0;
            }
        });
    });
    
    // Calcular automáticamente al presionar Enter
    document.querySelectorAll('.producto-precio, .producto-cantidad').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                calcularPromocion();
            }
        });
    });
    
    console.log('✅ Calculadora de promociones cargada');
});