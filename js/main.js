// Formatea un número como "3,800.00" (con coma de miles y 2 decimales)
function formatearPrecio(numero) {
  return numero.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

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
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('activo');
    });
  }

  // ── FILTRADO Y BÚSQUEDA (CATÁLOGO) ──
  const botones = document.querySelectorAll('.filtro-btn');
  const cards = document.querySelectorAll('.card');
  const buscadorInput = document.getElementById('buscador-input');

  let categoriaActual = 'todos';

  function aplicarFiltros() {
    const texto = buscadorInput ? buscadorInput.value.toLowerCase().trim() : '';

    cards.forEach(card => {
      const categoria = card.dataset.categoria;
      const h3El = card.querySelector('h3');
      const pEl = card.querySelector('p');
      
      const nombre = h3El ? h3El.textContent.toLowerCase() : '';
      const descripcion = pEl ? pEl.textContent.toLowerCase() : '';

      const coincideCategoria = (categoriaActual === 'todos' || categoria === categoriaActual);
      const coincideTexto = (nombre.includes(texto) || descripcion.includes(texto));

      if (coincideCategoria && coincideTexto) {
        card.style.display = 'block'; 
      } else {
        card.style.display = 'none'; 
      }
    });
  }

  // Eventos para los botones de categoría (Todos, Mujer, Hombre, Unisex)
  if (botones.length > 0) {
    botones.forEach(btn => {
      btn.addEventListener('click', () => {
        botones.forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');
        categoriaActual = btn.dataset.filtro;
        aplicarFiltros();
      });
    });
  }

  // Evento para la barra de búsqueda en tiempo real
  if (buscadorInput) {
    buscadorInput.addEventListener('input', () => {
      aplicarFiltros();
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

  if (carritoFlotante) {
    carritoFlotante.addEventListener('click', () => {
      carritoPanel.classList.add('abierto');
      overlay.classList.add('activo');
    });
  }

  if (cerrarCarrito) cerrarCarrito.addEventListener('click', cerrar);
  if (overlay) overlay.addEventListener('click', cerrar);

  function cerrar() {
    carritoPanel.classList.remove('abierto');
    overlay.classList.remove('activo');
  }

  const botonesAgregar = document.querySelectorAll('.btn-agregar');
  botonesAgregar.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.card');
      if (card.dataset.agotado === 'true') return;

      const nombre = card.querySelector('h3').textContent;
      const precio = parseFloat(
        card.querySelector('.precio').textContent
          .replace('L.', '')
          .replace(/,/g, '')
          .trim()
      );
      const imagen = card.querySelector('img') ? card.querySelector('img').src : '';

      const existe = carrito.find(p => p.nombre === nombre);
      if (existe) {
        existe.cantidad++;
      } else {
        carrito.push({ nombre, precio, imagen, cantidad: 1 });
      }

      actualizarCarrito();
      btn.textContent = '✅ Agregado';
      setTimeout(() => { btn.textContent = 'Agregar al carrito'; }, 1500);
    });
  });

  function actualizarCarrito() {
    if (!carritoItems) return;
    const total = carrito.reduce((sum, p) => sum + p.cantidad, 0);
    if (contadorEl) contadorEl.textContent = total;

    if (carrito.length === 0) {
      carritoItems.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
    } else {
      carritoItems.innerHTML = carrito.map((p, i) => `
        <div class="carrito-item">
          <img src="${p.imagen}" alt="${p.nombre}">
          <div class="carrito-item-info">
            <h4>${p.nombre}</h4>
            <p>L. ${formatearPrecio(p.precio)} x ${p.cantidad}</p>
          </div>
          <button class="carrito-item-eliminar" data-index="${i}">🗑️</button>
        </div>
      `).join('');

      document.querySelectorAll('.carrito-item-eliminar').forEach(btn => {
        btn.addEventListener('click', () => {
          carrito.splice(parseInt(btn.dataset.index), 1);
          actualizarCarrito();
        });
      });
    }
    const totalPrecio = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
    if (carritoTotal) carritoTotal.textContent = `L. ${formatearPrecio(totalPrecio)}`;
  }

  if (btnFinalizar) {
    btnFinalizar.addEventListener('click', () => {
      if (carrito.length === 0) return alert('⚠️ Tu carrito está vacío');
      let mensaje = '🛒 *Hola, quiero hacer un pedido:*\n\n';
      carrito.forEach(p => mensaje += `• ${p.nombre} x${p.cantidad} - L. ${formatearPrecio(p.precio * p.cantidad)}\n`);
      const total = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
      mensaje += `\n💰 *Total: L. ${formatearPrecio(total)}*`;
      window.open(`https://wa.me/50493017653?text=${encodeURIComponent(mensaje)}`, '_blank');
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
        const asunto = document.getElementById('asunto');
        if (asunto) asunto.value = '';
        document.getElementById('mensaje').value = '';
        mensajeExito.style.display = 'none';
        btnEnviar.textContent = 'Enviar mensaje';
        btnEnviar.disabled = false;
      }, 3000);
    });
  }

  // ── PRODUCTOS AGOTADOS ──
  cards.forEach(card => {
    if (card.dataset.agotado === 'true') {
      card.classList.add('agotado');
      const etiqueta = document.createElement('span');
      etiqueta.classList.add('etiqueta-agotado');
      etiqueta.textContent = '🚫 Agotado';
      const btn = card.querySelector('.btn-agregar');
      if (btn) {
        btn.textContent = 'No disponible';
        btn.disabled = true;
        card.insertBefore(etiqueta, btn);
      }
    }
  });     

  // ── CARRUSEL DESLIZANTE AUTOMÁTICO (DINÁMICO) ──
  const sliderContainer = document.getElementById('sliderContainer');
  const slides = document.querySelectorAll('.slide');
  let currentSlide = 0;

  if (sliderContainer && slides.length > 0) {
    sliderContainer.style.width = `${slides.length * 100}%`;
    slides.forEach(slide => {
      slide.style.width = `${100 / slides.length}%`;
    });

    setInterval(() => {
      currentSlide = (currentSlide + 1) % slides.length;
      const porcentaje = currentSlide * (100 / slides.length);
      sliderContainer.style.transform = `translateX(-${porcentaje}%)`;
    }, 3500);
  }
});