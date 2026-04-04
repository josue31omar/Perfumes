document.addEventListener('DOMContentLoaded', () => {

  // ── MODO OSCURO ──
  const btnDark = document.getElementById('btn-dark');
  if (btnDark) {
    if (localStorage.getItem('modo') === 'oscuro') {
      document.body.classList.add('dark');
      btnDark.textContent = '☀️';
    }
    btnDark.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      const esDark = document.body.classList.contains('dark');
      btnDark.textContent = esDark ? '☀️' : '🌙';
      localStorage.setItem('modo', esDark ? 'oscuro' : 'claro');
    });
  }

  // ── MENÚ HAMBURGUESA ──
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('activo');
    });
  }

  // ── FILTROS DEL CATÁLOGO ──
  const botones = document.querySelectorAll('.filtro-btn');
  const cards = document.querySelectorAll('.card');

  if (botones.length > 0) {
    botones.forEach(btn => {
      btn.addEventListener('click', () => {
        botones.forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');
        const filtro = btn.dataset.filtro;
        cards.forEach(card => {
          if (filtro === 'todos' || card.dataset.categoria === filtro) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ── CARRITO COMPLETO ──
  let carrito = [];
  const contadorEl = document.getElementById('contador');
  const carritoPanel = document.getElementById('carrito-panel');
  const carritoItems = document.getElementById('carrito-items');
  const carritoTotal = document.getElementById('carrito-total');
  const cerrarCarrito = document.getElementById('cerrar-carrito');
  const overlay = document.getElementById('overlay');
  const btnFinalizar = document.getElementById('btn-finalizar');
  const carritoFlotante = document.querySelector('.carrito-flotante');

  // Abrir carrito al hacer clic en el flotante
  if (carritoFlotante) {
    carritoFlotante.addEventListener('click', () => {
      carritoPanel.classList.add('abierto');
      overlay.classList.add('activo');
    });
  }

  // Cerrar carrito
  if (cerrarCarrito) {
    cerrarCarrito.addEventListener('click', cerrar);
  }
  if (overlay) {
    overlay.addEventListener('click', cerrar);
  }

  function cerrar() {
    carritoPanel.classList.remove('abierto');
    overlay.classList.remove('activo');
  }

  // Agregar producto al carrito
  const botonesAgregar = document.querySelectorAll('.btn-agregar');
  if (botonesAgregar.length > 0) {
    botonesAgregar.forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.card');
        const nombre = card.querySelector('h3').textContent;
        const precio = parseFloat(card.querySelector('.precio').textContent.replace('$', ''));
        const imagen = card.querySelector('img') ? card.querySelector('img').src : '';

        // Verificar si ya está en el carrito
        const existe = carrito.find(p => p.nombre === nombre);
        if (existe) {
          existe.cantidad++;
        } else {
          carrito.push({ nombre, precio, imagen, cantidad: 1 });
        }

        actualizarCarrito();

        btn.textContent = '✅ Agregado';
        setTimeout(() => {
          btn.textContent = 'Agregar al carrito';
        }, 1500);
      });
    });
  }

  function actualizarCarrito() {
    if (!carritoItems) return;

    // Actualizar contador
    const total = carrito.reduce((sum, p) => sum + p.cantidad, 0);
    if (contadorEl) contadorEl.textContent = total;

    // Actualizar lista
    if (carrito.length === 0) {
      carritoItems.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
    } else {
      carritoItems.innerHTML = carrito.map((p, i) => `
        <div class="carrito-item">
          <img src="${p.imagen}" alt="${p.nombre}">
          <div class="carrito-item-info">
            <h4>${p.nombre}</h4>
            <p>$${p.precio.toFixed(2)} x ${p.cantidad}</p>
          </div>
          <button class="carrito-item-eliminar" data-index="${i}">🗑️</button>
        </div>
      `).join('');

      // Botones eliminar
      document.querySelectorAll('.carrito-item-eliminar').forEach(btn => {
        btn.addEventListener('click', () => {
          const index = parseInt(btn.dataset.index);
          carrito.splice(index, 1);
          actualizarCarrito();
        });
      });
    }

    // Actualizar total
    const totalPrecio = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
    if (carritoTotal) carritoTotal.textContent = `$${totalPrecio.toFixed(2)}`;
  }

  // Finalizar compra por WhatsApp
  if (btnFinalizar) {
    btnFinalizar.addEventListener('click', () => {
      if (carrito.length === 0) {
        alert('⚠️ Tu carrito está vacío');
        return;
      }

      let mensaje = '🛒 *Hola, quiero hacer un pedido:*\n\n';
      carrito.forEach(p => {
        mensaje += `• ${p.nombre} x${p.cantidad} - $${(p.precio * p.cantidad).toFixed(2)}\n`;
      });
      const total = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
      mensaje += `\n💰 *Total: $${total.toFixed(2)}*`;

      const url = `https://wa.me/50493017653?text=${encodeURIComponent(mensaje)}`;
      window.open(url, '_blank');
    });
  }

  // ── FORMULARIO DE CONTACTO ──
  const btnEnviar = document.getElementById('btn-enviar');
  const mensajeExito = document.getElementById('mensaje-exito');

  if (btnEnviar) {
    btnEnviar.addEventListener('click', () => {
      const nombre = document.getElementById('nombre').value.trim();
      const email = document.getElementById('email').value.trim();
      const mensaje = document.getElementById('mensaje').value.trim();

      if (nombre === '' || email === '' || mensaje === '') {
        alert('⚠️ Por favor completa todos los campos obligatorios.');
        return;
      }

      mensajeExito.style.display = 'block';
      btnEnviar.textContent = '✅ Enviado';
      btnEnviar.disabled = true;

      setTimeout(() => {
        document.getElementById('nombre').value = '';
        document.getElementById('email').value = '';
        document.getElementById('asunto').value = '';
        document.getElementById('mensaje').value = '';
        mensajeExito.style.display = 'none';
        btnEnviar.textContent = 'Enviar mensaje';
        btnEnviar.disabled = false;
      }, 3000);
    });
  }

  // ── BUSCADOR ──
  const buscadorInput = document.getElementById('buscador-input');

  if (buscadorInput) {
    buscadorInput.addEventListener('input', () => {
      const texto = buscadorInput.value.toLowerCase().trim();

      cards.forEach(card => {
        const nombre = card.querySelector('h3').textContent.toLowerCase();
        const descripcion = card.querySelector('p').textContent.toLowerCase();

        if (nombre.includes(texto) || descripcion.includes(texto)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });

      // Resetear filtros al buscar
      botones.forEach(b => b.classList.remove('activo'));
      document.querySelector('[data-filtro="todos"]').classList.add('activo');
    });
  }

  // ── PRODUCTOS AGOTADOS ──
  cards.forEach(card => {
    if (card.dataset.agotado === 'true') {
      card.classList.add('agotado');

      // Agregar etiqueta agotado
      const etiqueta = document.createElement('span');
      etiqueta.classList.add('etiqueta-agotado');
      etiqueta.textContent = '🚫 Agotado';

      // Insertarla antes del botón
      const btn = card.querySelector('.btn-agregar');
      btn.textContent = 'No disponible';
      card.insertBefore(etiqueta, btn);
    }
  });
  
});