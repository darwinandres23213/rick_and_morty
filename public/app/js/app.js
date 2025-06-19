let allChars = [];
let dbChars = [];
let currentEditId = null;
let currentPage = 1;
let perPage = 20;
let currentChars = [];
let filteredChars = [];
let dataSource = 'db';

function showSpinner() {
  document.getElementById('global-spinner-overlay').style.display = 'flex';
}
function hideSpinner() {
  document.getElementById('global-spinner-overlay').style.display = 'none';
}

async function loadApi() {
  showSpinner();
  try {
    allChars = [];
    let page = 1;
    while (allChars.length < 100) {
      const res = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
      if (!res.ok) {
        let err = await res.json().catch(() => ({ error: 'Error al consumir la API.' }));
        throw err;
      }
      const data = await res.json();
      allChars.push(...data.results);
      page++;
    }
    allChars = allChars.slice(0, 100);
    dataSource = 'api';
    currentPage = 1;
    filteredChars = [];
    document.getElementById('search-input').value = '';
    renderCards(allChars, false);
    updateApiInfo();
  } catch (e) {
    let msg = e && e.error ? e.error : (e.message || 'No se pudo conectar con el servidor. Verifica tu conexión a internet.');
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: msg
    });
  } finally {
    hideSpinner();
  }
}

// Carga y render desde BD
async function loadDb() {
  showSpinner();
  try {
    const res = await fetch('/api/characters');
    if (!res.ok) {
      let err = await res.json().catch(() => ({ error: 'Error al consultar la base de datos.' }));
      throw err;
    }
    dbChars = await res.json();
    dataSource = 'db';
    currentPage = 1;
    filteredChars = [];
    document.getElementById('search-input').value = '';
    renderCards(dbChars, true);
    updateApiInfo();
    if (dbChars.length > 0) {
      document.getElementById('controls-row').classList.remove('d-none');
    }
    const btnSave = document.getElementById('btn-save');
    const savedCheck = document.getElementById('saved-check');
    const editWarning = document.getElementById('edit-warning');
    if (dbChars.length > 0) {
      btnSave.disabled = true;
      savedCheck.classList.remove('d-none');
      editWarning.classList.add('d-none');
    } else {
      btnSave.disabled = false;
      savedCheck.classList.add('d-none');
      editWarning.classList.remove('d-none');
    }
  } catch (e) {
    let msg = e && e.error ? e.error : (e.message || 'No se pudo conectar con la base de datos.');
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: msg
    });
  } finally {
    hideSpinner();
  }
}

function renderPaginationControls(total, page, perPage) {
  const controls = document.getElementById('pagination-controls');
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) {
    controls.innerHTML = '';
    return;
  }
  let html = `<nav><ul class='pagination mb-0'>`;
  html += `<li class='page-item${page === 1 ? ' disabled' : ''}'><a class='page-link' href='#' data-page='${page - 1}'>Anterior</a></li>`;
  for (let i = 1; i <= totalPages; i++) {
    html += `<li class='page-item${i === page ? ' active' : ''}'><a class='page-link' href='#' data-page='${i}'>${i}</a></li>`;
  }
  html += `<li class='page-item${page === totalPages ? ' disabled' : ''}'><a class='page-link' href='#' data-page='${page + 1}'>Siguiente</a></li>`;
  html += `</ul></nav>`;
  controls.innerHTML = html;
  controls.querySelectorAll('a.page-link').forEach(a => {
    a.onclick = e => {
      e.preventDefault();
      const p = parseInt(a.getAttribute('data-page'));
      if (p >= 1 && p <= totalPages) {
        currentPage = p;
        renderCards(currentChars, currentChars === dbChars);
      }
    };
  });
}

function getFavorites() {
  return JSON.parse(localStorage.getItem('favorites') || '[]');
}

function setFavorites(favs) {
  localStorage.setItem('favorites', JSON.stringify(favs));
}

function toggleFavorite(id) {
  let favs = getFavorites();
  if (favs.includes(id)) {
    favs = favs.filter(f => f !== id);
  } else {
    favs.push(id);
  }
  setFavorites(favs);
  renderCards(currentChars, currentChars === dbChars);
}

function renderCards(chars, isDb) {
  currentChars = chars;
  const container = document.getElementById('cards-container');
  container.innerHTML = '';
  const favorites = getFavorites();
  if (chars.length === 0) {
    container.innerHTML = '<div class="col-12 text-center text-muted py-5">No se encontró ningún personaje.</div>';
    renderPaginationControls(0, 1, perPage);
    return;
  }
  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  chars.slice(start, end).forEach(c => {
    const col = document.createElement('div');
    col.className = 'col-12 col-sm-6 col-md-4 col-lg-3';
    const isFav = favorites.includes(c.id);
    col.innerHTML = `
      <div class="card h-100 position-relative">
        <span class="favorite-heart" data-id="${c.id}" title="Marcar como favorito">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="${isFav ? '#ff3b7a' : 'none'}" stroke="#ff3b7a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 2px #fff);">
            <path d="M14 24C14 24 4 15.36 4 9.5C4 6.42 6.92 4 10 4C12.02 4 13.91 5.09 14.99 6.67C16.07 5.09 17.96 4 20 4C23.08 4 26 6.42 26 9.5C26 15.36 16 24 16 24H14Z"/>
          </svg>
        </span>
        <img src="${c.image}" class="card-img-top" alt="${c.name}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${c.name}</h5>
          <p class="card-text mb-1"><strong>ID:</strong> ${c.id}</p>
          <p class="card-text mb-1"><strong>Status:</strong> ${c.status}</p>
          <p class="card-text mb-3"><strong>Especie:</strong> ${c.species}</p>
          <div class="mt-auto text-end">
            <button class="btn btn-outline-primary btn-sm detail-btn" data-id="${c.id}" data-isdb="${isDb}">Detalle</button>
            ${isDb ? `<button class="btn btn-outline-secondary btn-sm edit-btn ms-1" data-id="${c.id}">Editar</button>` : ''}
          </div>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
  renderPaginationControls(chars.length, currentPage, perPage);
  attachEvents();
  document.querySelectorAll('.favorite-heart').forEach(el => {
    el.onclick = e => {
      e.stopPropagation();
      toggleFavorite(Number(el.getAttribute('data-id')));
    };
  });
}

function attachEvents() {
  document.querySelectorAll('.detail-btn').forEach(btn => {
    btn.onclick = () => openModal(btn.dataset.id, btn.dataset.isdb === 'true', false);
  });
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.onclick = () => openModal(btn.dataset.id, true, true);
  });
}

function openModal(id, isDb, isEdit) {
  const modalEl = document.getElementById('detailModal');
  const modal = new bootstrap.Modal(modalEl);
  const char = (isDb ? dbChars : allChars).find(c => c.id == id);
  currentEditId = isEdit ? id : null;

  const safe = v => v && v !== '-' && v !== '' ? v : 'No se tiene información';

  document.getElementById('detail-view').classList.toggle('d-none', isEdit);
  document.getElementById('edit-view').classList.toggle('d-none', !isEdit);

  document.getElementById('modal-image').src = char.image;

  document.getElementById('modal-id').textContent = char.id;
  document.getElementById('modal-name').textContent = safe(char.name);
  document.getElementById('modal-status').textContent = safe(char.status);
  document.getElementById('modal-species').textContent = safe(char.species);
  document.getElementById('modal-type').textContent = safe(char.type);
  document.getElementById('modal-gender').textContent = safe(char.gender);
  let originName = char.origin_name || (char.origin && char.origin.name) || '';
  let originUrl = char.origin_url || (char.origin && char.origin.url) || '';
  document.getElementById('modal-origin-name').textContent = safe(originName);
  const locationEl = document.getElementById('modal-origin-url');
  if (originUrl && originUrl !== 'No se tiene información' && originUrl !== '#') {
    locationEl.textContent = originUrl;
    locationEl.href = originUrl;
    locationEl.style.pointerEvents = '';
    locationEl.style.color = '';
  } else {
    locationEl.textContent = 'No se tiene información';
    locationEl.removeAttribute('href');
    locationEl.style.pointerEvents = 'none';
    locationEl.style.color = '#6c757d';
  }

  document.getElementById('modal-id-edit').textContent = char.id;
  document.getElementById('input-name').value = char.name || '';
  document.getElementById('input-status').value = char.status || '';
  document.getElementById('input-species').value = char.species || '';
  document.getElementById('input-type').value = char.type || '';
  document.getElementById('input-gender').value = char.gender || '';
  document.getElementById('input-origin-name').value = originName;
  const locationEditEl = document.getElementById('modal-origin-url-edit');
  if (originUrl && originUrl !== 'No se tiene información' && originUrl !== '#') {
    locationEditEl.textContent = originUrl;
    locationEditEl.href = originUrl;
    locationEditEl.style.pointerEvents = '';
    locationEditEl.style.color = '';
  } else {
    locationEditEl.textContent = 'No se tiene información';
    locationEditEl.removeAttribute('href');
    locationEditEl.style.pointerEvents = 'none';
    locationEditEl.style.color = '#6c757d';
  }

  document.getElementById('modal-save').classList.toggle('d-none', !isEdit);

  document.getElementById('modal-save').onclick = () => saveEdit(char.id);

  modal.show();
}

async function saveEdit(id) {
  const payload = {
    name: document.getElementById('input-name').value,
    status: document.getElementById('input-status').value,
    species: document.getElementById('input-species').value,
    type: document.getElementById('input-type').value,
    gender: document.getElementById('input-gender').value,
    origin_name: document.getElementById('input-origin-name').value,
  };
  showSpinner();
  try {
    const resp = await fetch(`/api/characters/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (resp.ok) {
      Swal.fire({
        icon: 'success',
        title: '¡Editado!',
        text: 'El personaje fue editado correctamente.'
      });
      loadDb();
      bootstrap.Modal.getInstance(document.getElementById('detailModal')).hide();
    } else {
      let err = await resp.json().catch(() => ({ error: 'No se pudo editar el personaje.' }));
      throw err;
    }
  } catch (e) {
    let msg = e && e.error ? e.error : (e.message || 'No se pudo editar el personaje.');
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: msg
    });
  } finally {
    hideSpinner();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('controls-row').classList.add('d-none');
  document.getElementById('btn-save').classList.add('d-none');
  document.getElementById('edit-warning').classList.add('d-none');
  loadDb();
});

document.getElementById('btn-load-api').onclick = async () => {
  document.getElementById('btn-save').classList.remove('d-none');
  const editWarning = document.getElementById('edit-warning');
  if (dbChars.length > 0) {
    editWarning.classList.add('d-none');
  } else {
    editWarning.innerHTML = 'Debes guardar los personajes en la base de datos para poder editarlos.';
    editWarning.classList.remove('d-none');
  }
  document.getElementById('controls-row').classList.remove('d-none');
  await loadApi();
};

document.getElementById('btn-save').onclick = async () => {
  if (dbChars.length > 0) {
    Swal.fire({
      icon: 'info',
      title: 'Ya guardado',
      text: 'Los personajes ya están en la base de datos.'
    });
    return;
  }
  showSpinner();
  try {
    const resp = await fetch('/api/characters/store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(allChars)
    });
    if (resp.ok) {
      Swal.fire({
        icon: 'success',
        title: '¡Guardado!',
        text: 'Los personajes se guardaron correctamente.'
      });
      document.getElementById('btn-save').disabled = true;
      document.getElementById('saved-check').classList.remove('d-none');
      document.getElementById('edit-warning').classList.add('d-none');
      loadDb();
    } else {
      let err = await resp.json().catch(() => ({ error: 'No se pudieron guardar los personajes.' }));
      throw err;
    }
  } catch (e) {
    let msg = e && e.error ? e.error : (e.message || 'No se pudieron guardar los personajes.');
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: msg
    });
  } finally {
    hideSpinner();
  }
};

function getActiveChars() {
  return dataSource === 'db' ? dbChars : allChars;
}

document.getElementById('search-input').oninput = function () {
  const search = this.value.trim().toLowerCase();
  const chars = getActiveChars();
  filteredChars = search ? chars.filter(c => c.name.toLowerCase().includes(search)) : chars;
  currentPage = 1;
  renderCards(filteredChars, chars === dbChars);
};

document.getElementById('per-page').onchange = function () {
  perPage = parseInt(this.value);
  currentPage = 1;
  const chars = filteredChars.length || document.getElementById('search-input').value ? filteredChars : getActiveChars();
  renderCards(chars, chars === dbChars);
};

function updateApiInfo() {
  const apiInfo = document.getElementById('api-info');
  if (dataSource === 'api' && dbChars.length > 0) {
    apiInfo.classList.remove('d-none');
  } else {
    apiInfo.classList.add('d-none');
  }
}

document.getElementById('btn-view-db').onclick = function () {
  loadDb();
};

// 4. Evento para mostrar solo favoritos o todos
let showingFavorites = false;
document.getElementById('show-favorites').addEventListener('click', function() {
  showingFavorites = !showingFavorites;
  this.textContent = showingFavorites ? 'Ver todos' : 'Ver favoritos';
  if (showingFavorites) {
    // Mostrar solo favoritos
    const favIds = getFavorites();
    const chars = getActiveChars().filter(c => favIds.includes(c.id));
    renderCards(chars, dataSource === 'db');
  } else {
    // Mostrar todos
    const chars = filteredChars.length || document.getElementById('search-input').value ? filteredChars : getActiveChars();
    renderCards(chars, dataSource === 'db');
  }
});

loadDb();