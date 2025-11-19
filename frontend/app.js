// app.js
// Lógica de la interfaz:
// - Buscar un Pokémon concreto por nombre o ID.
// - Mostrar un listado paginado de Pokémon.
// - Reutilizar la vista detallada cuando se hace clic en un Pokémon del listado.

// Configuración del endpoint del backend
const API_BASE_URL = "http://localhost:3000/api/pokemon";

// Referencias a elementos del DOM
const pokemonInput = document.getElementById("pokemonInput");
const searchButton = document.getElementById("searchButton");
const loadingSection = document.getElementById("loading");
const resultadoSection = document.getElementById("resultado");

// Elementos del listado
const pokemonListBody = document.getElementById("pokemonListBody");
const prevPageBtn = document.getElementById("prevPageBtn");
const nextPageBtn = document.getElementById("nextPageBtn");
const paginationInfo = document.getElementById("paginationInfo");

// Cache simple en memoria para evitar peticiones repetidas
const pokemonCache = new Map();

// Estado de paginación
let currentPage = 1;
const pageLimit = 20; // resultados por página

/**
 * Muestra u oculta el estado de carga global.
 */
function setLoading(isLoading) {
  if (isLoading) {
    loadingSection.classList.remove("d-none");
    searchButton.disabled = true;
    prevPageBtn.disabled = true;
    nextPageBtn.disabled = true;
  } else {
    loadingSection.classList.add("d-none");
    searchButton.disabled = false;
    prevPageBtn.disabled = false;
    nextPageBtn.disabled = false;
  }
}

/**
 * Muestra un mensaje de error en el contenedor de resultado.
 */
function showError(message) {
  resultadoSection.innerHTML = `
    <div class="alert alert-danger" role="alert">
      ${message}
    </div>
  `;
  resultadoSection.classList.remove("d-none");
}

/**
 * Muestra los datos del Pokémon en una card de Bootstrap.
 */
function showPokemon(data) {
  const { name, id, sprites, types, height, weight, stats } = data;

  const imageUrl =
    sprites?.other?.["official-artwork"]?.front_default ||
    sprites?.front_default ||
    "";

  const typesHtml = (types || [])
    .map(
      (t) =>
        `<span class="badge bg-secondary pokemon-type-badge">${t.type.name}</span>`
    )
    .join(" ");

  const statsHtml = (stats || [])
    .map((s) => {
      const statName = s.stat.name.replace("-", " ");
      return `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <span class="text-capitalize">${statName}</span>
          <span class="badge bg-primary rounded-pill">${s.base_stat}</span>
        </li>
      `;
    })
    .join("");

  resultadoSection.innerHTML = `
    <div class="card shadow-sm">
      <div class="row g-0">
        <div class="col-md-4 text-center p-3">
          ${
            imageUrl
              ? `<img
                   src="${imageUrl}"
                   alt="${name}"
                   class="img-fluid"
                   style="max-height: 180px; object-fit: contain;"
                 />`
              : '<div class="text-muted">Sin imagen disponible</div>'
          }
          <p class="mt-2 mb-0">
            <span class="badge bg-dark">#${id
              .toString()
              .padStart(3, "0")}</span>
          </p>
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title pokemon-name">${name}</h5>
            <p class="card-text mb-1">
              <strong>Tipos:</strong> ${typesHtml || "Desconocido"}
            </p>
            <p class="card-text mb-1">
              <strong>Altura:</strong> ${
                height ? (height / 10).toFixed(1) + " m" : "N/D"
              }
            </p>
            <p class="card-text mb-3">
              <strong>Peso:</strong> ${
                weight ? (weight / 10).toFixed(1) + " kg" : "N/D"
              }
            </p>
            <h6 class="card-subtitle mb-2">Estadísticas base</h6>
            <ul class="list-group list-group-flush">
              ${statsHtml || '<li class="list-group-item">Sin datos</li>'}
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;

  resultadoSection.classList.remove("d-none");
}

/**
 * Función principal de búsqueda de un Pokémon concreto.
 */
async function buscarPokemon(nombreOId) {
  const query = nombreOId.trim();

  if (!query) {
    showError("Por favor, introduce el nombre o ID de un Pokémon.");
    return;
  }

  const cacheKey = query.toLowerCase();
  if (pokemonCache.has(cacheKey)) {
    showPokemon(pokemonCache.get(cacheKey));
    return;
  }

  setLoading(true);
  resultadoSection.classList.add("d-none");

  try {
    const response = await fetch(
      `${API_BASE_URL}/${encodeURIComponent(cacheKey)}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        showError("Pokémon no encontrado. Revisa el nombre o el número.");
      } else {
        showError(`Error al consultar el Pokémon (código ${response.status}).`);
      }
      return;
    }

    const data = await response.json();

    pokemonCache.set(cacheKey, data);
    showPokemon(data);
  } catch (error) {
    console.error("Error en la petición fetch (detalle):", error);
    showError(
      "Error de conexión con el servidor. Verifica que el backend está arrancado."
    );
  } finally {
    setLoading(false);
  }
}

/**
 * Pinta el listado de Pokémon en la tabla.
 */
function renderPokemonList(listData) {
  const { results, page, limit, total, hasNextPage, hasPrevPage } = listData;

  // Actualizar info de paginación
  paginationInfo.textContent = `Página ${page} (mostrando ${limit} resultados de ${total})`;

  // Activar/desactivar botones según haya o no página anterior/siguiente
  prevPageBtn.disabled = !hasPrevPage;
  nextPageBtn.disabled = !hasNextPage;

  // Construir filas de la tabla
  const rowsHtml = results
    .map((pokemon) => {
      return `
        <tr>
          <td>#${pokemon.id.toString().padStart(3, "0")}</td>
          <td class="text-capitalize">${pokemon.name}</td>
          <td>
            <button
              class="btn btn-sm btn-outline-primary"
              data-pokemon-name="${pokemon.name}"
            >
              Ver detalle
            </button>
          </td>
        </tr>
      `;
    })
    .join("");

  pokemonListBody.innerHTML = rowsHtml;

  // Añadir eventos a los botones "Ver detalle"
  const detailButtons = pokemonListBody.querySelectorAll(
    "button[data-pokemon-name]"
  );
  detailButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.getAttribute("data-pokemon-name");
      pokemonInput.value = name;
      buscarPokemon(name);
    });
  });
}

/**
 * Carga la página actual del listado de Pokémon.
 */
async function cargarPaginaPokemon(page = 1) {
  setLoading(true);

  try {
    const url = `${API_BASE_URL}?limit=${pageLimit}&page=${page}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error("Error al obtener listado:", response.status);
      return;
    }

    const data = await response.json();

    // Actualizar estado actual
    currentPage = data.page;
    renderPokemonList(data);
  } catch (error) {
    console.error("Error en la petición fetch (listado):", error);
  } finally {
    setLoading(false);
  }
}

/**
 * Inicializar eventos de la interfaz.
 */
function initEvents() {
  // Buscar por botón
  searchButton.addEventListener("click", () => {
    buscarPokemon(pokemonInput.value);
  });

  // Buscar con Enter
  pokemonInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      buscarPokemon(pokemonInput.value);
    }
  });

  // Botón página anterior
  prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      cargarPaginaPokemon(currentPage - 1);
    }
  });

  // Botón página siguiente
  nextPageBtn.addEventListener("click", () => {
    cargarPaginaPokemon(currentPage + 1);
  });

  // Foco inicial
  pokemonInput.focus();
}

/**
 * Punto de entrada del frontend.
 */
document.addEventListener("DOMContentLoaded", () => {
  initEvents();
  // Cargar lista inicial (página 1)
  cargarPaginaPokemon(1);
});
