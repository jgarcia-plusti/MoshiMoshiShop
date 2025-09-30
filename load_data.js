// Notificación simple al agregar
function mostrarNotificacionCarrito(nombre) {
  let notif = document.createElement('div');
  notif.className = 'notificacion-carrito-barra';
  notif.style.position = 'fixed';
  notif.style.bottom = '0';
  notif.style.left = '0';
  notif.style.width = '100%';
  notif.style.height = '55px';
  notif.style.background = 'linear-gradient(90deg, #ffb6c1 0%, #ffe4e1 100%)';
  notif.style.color = '#333';
  notif.style.display = 'flex';
  notif.style.alignItems = 'center';
  notif.style.justifyContent = 'center';
  notif.style.fontSize = '1.2rem';
  notif.style.fontWeight = 'bold';
  notif.style.boxShadow = '0 -2px 8px rgba(0,0,0,0.08)';
  notif.style.zIndex = '9999';
  notif.style.borderTop = '2px solid #ff69b4';
  notif.innerHTML = `<span style="margin-right:8px;">🛒</span>¡<span style="color:#d63384;">${nombre} </span> agregado al carrito!`;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 1800);
}
// Renderizar el carrito en el modal lateral
function renderizarCarrito() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const contenedor = document.getElementById('carritoContenido');
  const totalSpan = document.getElementById('carritoTotal');
  let total = 0;
  if (carrito.length === 0) {
    contenedor.innerHTML = '<p class="text-center">Tu carrito está vacío.</p>';
    totalSpan.textContent = 'Q0';
    return;
  }
  let html = '<ul class="list-group mb-3">';
  carrito.forEach(prod => {
    let precioNum = parseFloat((prod.precio + '').replace(/[^\d.]/g, '')) || 0;
    let subtotal = precioNum * prod.cantidad;
    total += subtotal;
    html += `<li class="list-group-item d-flex justify-content-between align-items-center">
      <div>
        <div class="row">
          <div class="col-auto">
            <img src="${prod.imagen}" alt="${prod.titulo}" style="width:48px;height:48px;object-fit:cover;border-radius:8px;margin-right:8px;">
          </div>
        </div>
        <div class="row">
          <span class="fw-bold">${prod.titulo}</span><br>
        </div>
        <div class="row">
          <span class="text-muted">${prod.categoria}</span>
        </div>
      </div>
      <div class="align-items-center gap-2">
        <div class="row">
          <div class="col">
            <span class="badge bg-primary">x${prod.cantidad}</span>
          </div>
          <div class="col">
            <span class="ms-2">Q${subtotal.toFixed(2)}</span>
          </div>
        </div>
        <hr>
        <div class="row">
          <div class="col">
            <button class="btn btn-sm btn-outline-secondary btn-restar-carrito" data-id="${prod.id}">-</button>
          </div>
          <div class="col">
            <button class="btn btn-sm btn-outline-primary btn-aumentar-carrito" data-id="${prod.id}">+</button>
          </div>
          <div class="col">
            <button class="btn btn-sm btn-outline-danger btn-eliminar-carrito" data-id="${prod.id}">x</button>
          </div>
        </div>
      </div>
    </li>`;
  });
  html += '</ul>';
  contenedor.innerHTML = html;
  totalSpan.textContent = 'Q' + total.toFixed(2);
  // Actualizar el contador del ícono de carrito con la suma de cantidades
  const badge = document.getElementById('carritoCantidad');
  if (badge) {
    const cantidadTotal = carrito.reduce((acc, prod) => acc + (prod.cantidad || 1), 0);
    badge.textContent = cantidadTotal;
  }
  // Evento para disminuir cantidad
  contenedor.querySelectorAll('.btn-restar-carrito').forEach(btn => {
    btn.addEventListener('click', function () {
      const id = this.getAttribute('data-id');
      let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
      const index = carrito.findIndex(p => p.id === id);
      if (index > -1) {
        if (carrito[index].cantidad > 1) {
          carrito[index].cantidad -= 1;
        }
        else {
          carrito.splice(index, 1);
        }
        localStorage.setItem('carrito', JSON.stringify(carrito));
        renderizarCarrito();
        actualizarContadorCarrito();
      }
    });
  });

  // Evento para aumentar cantidad
  contenedor.querySelectorAll('.btn-aumentar-carrito').forEach(btn => {
    btn.addEventListener('click', function () {
      const id = this.getAttribute('data-id');
      let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
      const index = carrito.findIndex(p => p.id === id);
      if (index > -1) {
        carrito[index].cantidad += 1;
        localStorage.setItem('carrito', JSON.stringify(carrito));
        renderizarCarrito();
        actualizarContadorCarrito();
      }
    });
  });

  // Evento para eliminar cantidad
  contenedor.querySelectorAll('.btn-eliminar-carrito').forEach(btn => {
    btn.addEventListener('click', function () {
      const id = this.getAttribute('data-id');
      let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
      const index = carrito.findIndex(p => p.id === id);
      if (index > -1) {
        carrito.splice(index, 1);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        renderizarCarrito();
        actualizarContadorCarrito();
      }
    });
  });
}

// Actualizar el contador del ícono de carrito
function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const cantidad = carrito.reduce((acc, prod) => acc + (prod.cantidad || 1), 0);
  const badge = document.getElementById('carritoCantidad');
  if (badge) badge.textContent = cantidad;
}

// Evento para abrir el modal lateral del carrito
document.addEventListener('DOMContentLoaded', function () {
  const btnCarrito = document.getElementById('btnCarrito');
  if (btnCarrito) {
    btnCarrito.addEventListener('click', function (e) {
      e.preventDefault();
      renderizarCarrito();
      const modal = new bootstrap.Offcanvas(document.getElementById('modalCarrito'));
      modal.show();
    });
  }
  actualizarContadorCarrito();
});

// Actualizar contador cada vez que se agrega al carrito
function agregarAlCarrito(producto) {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  // Buscar por id único
  const index = carrito.findIndex(p => p.id === producto.id);
  if (index > -1) {
    carrito[index].cantidad = (carrito[index].cantidad || 1) + 1;
  } else {
    producto.cantidad = 1;
    carrito.push(producto);
  }
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarContadorCarrito();
  // Mostrar notificación al agregar
  if (producto.titulo) {
    mostrarNotificacionCarrito(producto.titulo);
  } else if (producto.nombre) {
    mostrarNotificacionCarrito(producto.nombre);
  } else {
    mostrarNotificacionCarrito('Producto');
  }
}
//
function goInit() {
  location.reload();
}

// Cargar todos los productos de todos los JSON en la carpeta data y mostrarlos en el grid de variedad
function cargarVariedadProductos() {
  // Lista de archivos JSON conocidos (puedes agregar más si tienes nuevos)
  const archivos = [
    'funcos', 'peluches', 'clasicos', 'jueguetes', 'samsung', 'iphone', 'xiaomi', 'honor',
    'gucci', 'prada', 'louis-vuitton', 'accesorios-gamer', 'figuras-gamer'
  ];
  const promesas = archivos.map(nombre => fetch(`public/data/${nombre}.json`).then(r => r.json()).catch(() => []));
  Promise.all(promesas).then(listas => {
    // Unir todos los productos en un solo array
    let productos = listas.flat();
    // Mezclar el array para mostrar variedad
    productos = productos.sort(() => Math.random() - 0.5);
    const grid = document.getElementById('gridVariedad');
    grid.innerHTML = '';
    productos.forEach(prod => {
      const card = document.createElement('div');
      card.className = 'col';
      card.innerHTML = `
        <div class="card h-100">
          <img src="${prod.imagen}" class="card-img-top producto-img" alt="${prod.titulo}">
          <div class="card-body">
            <h5 class="card-title">${prod.titulo}</h5>
            <p class="card-text">${prod.descripcion || ''}</p>
            <span class="badge bg-info">${prod.categoria || ''}</span>
            <p class="card-text fw-bold text-success">${prod.precio || ''}</p>
            <button class="btn btn-success btn-kawaii btn-add-cart" data-producto='${JSON.stringify(prod)}'>Agregar al carrito</button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
    // Evento para mostrar el modal al hacer click en la imagen
    document.querySelectorAll('.producto-img').forEach(img => {
      img.addEventListener('click', function () {
        const modalImg = document.getElementById('modalImg');
        modalImg.src = this.src;
        const modal = new bootstrap.Modal(document.getElementById('modalImagen'));
        modal.show();
      });
    });
    // Evento para agregar al carrito
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const producto = JSON.parse(this.getAttribute('data-producto'));
        agregarAlCarrito(producto);
      });
    });
  });
}

// Mostrar productos de variedad al hacer click en el botón de bienvenida
document.addEventListener('DOMContentLoaded', function () {
  cargarVariedadProductos();
  const btnVerProductos = document.querySelector('#welcomeSection .btn-kawaii');
  if (btnVerProductos) {
    btnVerProductos.addEventListener('click', function () {
      cargarVariedadProductos();
    });
  }
});

function cargarProductos(categoria) {
  fetch(`public/data/${categoria}.json`)
    .then(res => res.json())
    .then(productos => {
      const main = document.querySelector('main');
      main.innerHTML = '';
      if (productos.length === 0) {
        main.innerHTML = '<p>No hay productos disponibles.</p>';
        return;
      }
      // Crear campo de búsqueda
      const searchDiv = document.createElement('div');
      searchDiv.className = 'mb-4';
      searchDiv.innerHTML = `
          <input type="text" id="busquedaDescripcion" class="form-control input-kawaii" placeholder="Buscar..." style="max-width:400px; margin:auto;">
      `;
      main.appendChild(searchDiv);

      // Renderizar productos (función para reutilizar)
      function renderCards(productosFiltrados) {
        let grid = document.querySelector('.row');
        if (grid) grid.remove();
        grid = document.createElement('div');
        grid.className = 'row row-cols-1 row-cols-md-3 g-4';
        productosFiltrados.forEach(prod => {
          const card = document.createElement('div');
          card.className = 'col';
          card.innerHTML = `
            <div class="card h-100">
              <img src="${prod.imagen}" class="card-img-top producto-img" alt="${prod.titulo}">
              <div class="card-body">
                <h5 class="card-title">${prod.titulo}</h5>
                <p class="card-text">${prod.descripcion || ''}</p>
                <span class="badge bg-info">${prod.categoria || ''}</span>
                <p class="card-text fw-bold text-success">${prod.precio || ''}</p>
                <button class="btn btn-success btn-kawaii btn-add-cart" data-producto='${JSON.stringify(prod)}'>Agregar al carrito</button>
              </div>
            </div>
          `;
          grid.appendChild(card);
        });
        main.appendChild(grid);

        // Evento para mostrar el modal al hacer click en la imagen
        document.querySelectorAll('.producto-img').forEach(img => {
          img.addEventListener('click', function () {
            const modalImg = document.getElementById('modalImg');
            modalImg.src = this.src;
            const modal = new bootstrap.Modal(document.getElementById('modalImagen'));
            modal.show();
          });
        });
        // Evento para agregar al carrito
        document.querySelectorAll('.btn-add-cart').forEach(btn => {
          btn.addEventListener('click', function (e) {
            e.preventDefault();
            const producto = JSON.parse(this.getAttribute('data-producto'));
            agregarAlCarrito(producto);
          });
        });
        // Función para agregar productos al carrito
        // ...existing code...
      }
      // Inicialmente mostrar todos
      renderCards(productos);

      // Evento de búsqueda
      document.getElementById('busquedaDescripcion').addEventListener('input', function (e) {
        const texto = e.target.value.toLowerCase();
        const filtrados = productos.filter(prod => (prod.descripcion || '').toLowerCase().includes(texto));
        renderCards(filtrados);
      });

    })
    .catch(() => {
      document.querySelector('main').innerHTML = '<p>Error al cargar los productos.</p>';
    });
}

// Ejemplo: conectar el evento de click del submenú Funcos

document.addEventListener('DOMContentLoaded', function () {
  const funcosMenu = Array.from(document.querySelectorAll('a.dropdown-item')).find(a => a.textContent.trim() === 'Funcos');
  if (funcosMenu) {
    funcosMenu.addEventListener('click', function (e) {
      e.preventDefault();
      cargarProductos('funcos');
    });
  }
});
