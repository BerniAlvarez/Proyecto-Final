document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btn-inicio').addEventListener('click', () => document.getElementById('seccion-inicio').scrollIntoView({ behavior: 'smooth' }));
    document.getElementById('btn-combos').addEventListener('click', () => document.getElementById('seccion-combos').scrollIntoView({ behavior: 'smooth' }));
    document.getElementById('btn-pedidos').addEventListener('click', () => document.getElementById('seccion-pedidos').scrollIntoView({ behavior: 'smooth' }));
    document.getElementById('btn-contacto').addEventListener('click', () => document.getElementById('seccion-contacto').scrollIntoView({ behavior: 'smooth' }));

    
    let pedidoCombos = [];
    let pedidoTotal = 0;
    const MINIMO_COMPRA = 100000;
    const carritoContainer = document.getElementById('carrito-container');
    const carritoLista = document.getElementById('carrito-lista');
    const carritoTotalEl = document.getElementById('carrito-total');
    const btnPagar = document.getElementById('btn-pagar');


    function actualizarCarrito() {
        carritoLista.innerHTML = '';
        pedidoTotal = 0;
        
        if (pedidoCombos.length === 0) {
            carritoContainer.classList.add('carrito-escondido');
            carritoLista.innerHTML = '<li class="carrito-vacio">Tu pedido está vacío.</li>';
        } else {
            carritoContainer.classList.remove('carrito-escondido');
            pedidoCombos.forEach(item => {
                const li = document.createElement('li');
                li.setAttribute('data-id', item.id);
                li.innerHTML = `
                    <span>${item.nombre}</span>
                    <span>$${item.precio.toLocaleString('es-AR')}</span>
                    <button class="btn-eliminar" title="Eliminar item">&times;</button>
                `;
                carritoLista.appendChild(li);
                pedidoTotal += item.precio;
            });
        }
        carritoTotalEl.textContent = `$${pedidoTotal.toLocaleString('es-AR')}`;
    }

    function agregarCombo(nombre, precio) {
        pedidoCombos.push({ id: Date.now(), nombre, precio });
        actualizarCarrito();
        
       
        const notificacion = document.createElement('div');
        notificacion.className = 'notificacion';
        notificacion.textContent = `¡${nombre} agregado al pedido!`;
        document.body.appendChild(notificacion);
        setTimeout(() => notificacion.remove(), 3000);
    }

   
    document.getElementById('adquirir-combo1').addEventListener('click', (e) => {
        e.preventDefault();
        agregarCombo("Combo Contravención", 85000);
    });
    document.getElementById('adquirir-combo2').addEventListener('click', (e) => {
        e.preventDefault();
        agregarCombo("Combo Alcoholímetro", 120000);
    });
    document.getElementById('adquirir-combo3').addEventListener('click', (e) => {
        e.preventDefault();
        agregarCombo("Combo Hidratación", 65000);
    });

    
    carritoLista.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-eliminar')) {
            const idAEliminar = parseInt(e.target.closest('li').getAttribute('data-id'));
            pedidoCombos = pedidoCombos.filter(item => item.id !== idAEliminar);
            actualizarCarrito();
        }
    });

    document.getElementById('btn-vaciar-carrito').addEventListener('click', function() {
        pedidoCombos = [];
        actualizarCarrito();
    });

    btnPagar.addEventListener('click', function() {
        if (pedidoTotal < MINIMO_COMPRA) {
            alert(`Compra inválida. El monto mínimo del pedido es de $${MINIMO_COMPRA.toLocaleString('es-AR')}.`);
        } else {
            alert('¡Compra realizada con éxito! Gracias por su pedido.');
            pedidoCombos = [];
            actualizarCarrito();
        }
    });

    
    document.getElementById('form-personalizado').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const productos = [
            { nombre: 'Coca-Cola 2.25L', precio: 1800, cantidad: document.getElementById('input-coca').value },
            { nombre: 'Quilmes 1L', precio: 1200, cantidad: document.getElementById('input-quilmes').value },
            { nombre: 'Villavicencio 2L', precio: 800, cantidad: document.getElementById('input-villavicencio').value },
            { nombre: 'Sprite 2.25L', precio: 1700, cantidad: document.getElementById('input-sprite').value },
            { nombre: 'Stella Artois 1L', precio: 1300, cantidad: document.getElementById('input-stella').value },
            { nombre: 'Heineken 1L', precio: 1500, cantidad: document.getElementById('input-heineken').value }
        ];
        
        let totalPersonalizado = 0;
        let descripcion = 'Pedido personalizado: ';
        
        productos.forEach(prod => {
            const cantidad = parseInt(prod.cantidad) || 0;
            if (cantidad > 0) {
                totalPersonalizado += cantidad * prod.precio;
                descripcion += `${prod.nombre} (${cantidad}), `;
            }
        });
        
        if (totalPersonalizado > 0) {
            agregarCombo(descripcion, totalPersonalizado);
            this.reset();
        } else {
            const notificacion = document.createElement('div');
            notificacion.className = 'notificacion';
            notificacion.textContent = 'Agrega al menos un producto';
            document.body.appendChild(notificacion);
            setTimeout(() => notificacion.remove(), 3000);
        }
    });

    
    actualizarCarrito();
});