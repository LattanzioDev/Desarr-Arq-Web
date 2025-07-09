const allButton = document.getElementById('get-all');
const filterForm = document.getElementById('filter-form');
const resultsDiv = document.getElementById('results');
const errorDiv = document.getElementById('error');

const API_URL = 'https://rickandmortyapi.com/api/character';

function renderCharacters(characters) {
  resultsDiv.innerHTML = '';
  characters.forEach(char => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <img src="${char.image}" alt="${char.name}" />
      <h3>${char.name}</h3>
      <p><strong>Estado:</strong> ${char.status}</p>
      <p><strong>Especie:</strong> ${char.species}</p>
      <p><strong>Género:</strong> ${char.gender}</p>
    `;
    resultsDiv.appendChild(card);
  });
}

function mostrarError(mensaje) {
  errorDiv.textContent = mensaje;
  errorDiv.classList.remove('oculto');
}

function limpiarError() {
  errorDiv.textContent = '';
  errorDiv.classList.add('oculto');
}

async function fetchAllCharacters() {
  try {
    limpiarError();
    resultsDiv.innerHTML = 'Cargando personajes...';

    const firstPage = await fetch(API_URL);
    if (!firstPage.ok) throw new Error('No se pudo obtener la información');
    const data = await firstPage.json();

    const totalPages = data.info.pages;
    let allCharacters = [...data.results];

    // Crear array de promesas para páginas 2 a N
    const fetchPromises = [];
    for (let i = 2; i <= totalPages; i++) {
      fetchPromises.push(fetch(`${API_URL}?page=${i}`).then(res => res.json()));
    }

    // Esperar a todas las respuestas
    const allResults = await Promise.all(fetchPromises);
    allResults.forEach(page => {
      allCharacters.push(...page.results);
    });

    renderCharacters(allCharacters);
  } catch (error) {
    resultsDiv.innerHTML = '';
    mostrarError(error.message);
  }
}

allButton.addEventListener('click', () => {
  fetchAllCharacters();
});

//Búsqueda con filtros
filterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const status = document.getElementById('status').value;
  const species = document.getElementById('species').value;
  const type = document.getElementById('type').value;
  const gender = document.getElementById('gender').value;

  const queryParams = new URLSearchParams();
  if (name) queryParams.append('name', name);
  if (status) queryParams.append('status', status);
  if (species) queryParams.append('species', species);
  if (type) queryParams.append('type', type);
  if (gender) queryParams.append('gender', gender);

  const url = `${API_URL}/?${queryParams.toString()}`;
  fetchCharactersWithFilters(url);
});

async function fetchCharactersWithFilters(url) {
  try {
    limpiarError();
    resultsDiv.innerHTML = 'Buscando...';
    
    const firstPage = await fetch(url);
    if (!firstPage.ok) throw new Error('No se encontraron personajes.');
    const data = await firstPage.json();

    const totalPages = data.info.pages;
    let filteredCharacters = [...data.results];

    const fetchPromises = [];
    for (let i = 2; i <= totalPages; i++) {
      const pagedUrl = `${url}&page=${i}`;
      fetchPromises.push(fetch(pagedUrl).then(res => res.json()));
    }

    const allResults = await Promise.all(fetchPromises);
    allResults.forEach(page => {
      filteredCharacters.push(...page.results);
    });

    renderCharacters(filteredCharacters);
  } catch (error) {
    resultsDiv.innerHTML = '';
    mostrarError(error.message);
  }
}

