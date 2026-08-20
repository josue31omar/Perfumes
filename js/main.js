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

  // ── BUSCADOR ──
  const buscadorInput = document.getElementById('buscador-input');
  if (buscadorInput) {
    buscadorInput.addEventListener('input', () => {
      const texto = buscadorInput.value.toLowerCase().trim();
      cards.forEach(card => {
        const nombre = card.querySelector('h3').textContent.toLowerCase();
        const descripcion = card.querySelector('p').textContent.toLowerCase();
        card.style.display = (nombre.includes(texto) || descripcion.includes(texto)) ? 'block' : 'none';
      });
      botones.forEach(b => b.classList.remove('activo'));
      const fT = document.querySelector('[data-filtro="todos"]');
      if (fT) fT.classList.add('activo');
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
        card.insertBefore(etiqueta, btn);
      }
    }
  });     

  // ── CARRUSEL DESLIZANTE AUTOMÁTICO (DINÁMICO) ──
  const sliderContainer = document.getElementById('sliderContainer');
  const slides = document.querySelectorAll('.slide');
  let currentSlide = 0;

  if (sliderContainer && slides.length > 0) {
    // Ajustamos dinámicamente el ancho del contenedor según la cantidad de imágenes
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