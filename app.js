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

async function fetchCharacters(url) {
  try {
    limpiarError();
    resultsDiv.innerHTML = 'Cargando...';
    const response = await fetch(url);
    if (!response.ok) throw new Error('No se encontraron personajes.');
    const data = await response.json();
    if (!data.results || data.results.length === 0) throw new Error('No hay personajes para mostrar.');
    renderCharacters(data.results);
  } catch (error) {
    resultsDiv.innerHTML = '';
    mostrarError(error.message);
  }
}

allButton.addEventListener('click', () => {
  fetchCharacters(API_URL);
});

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
  fetchCharacters(url);
});
