const apiUrl = 'https://api.thedogapi.com/v1/breeds';
const dogListContainer = document.getElementById('dogList');
const filterInput = document.getElementById('filterInput');
const detailsContainer = document.getElementById('detailsContainer');

let dogs = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let timer;

// Função genérica para adicionar eventos aos elementos de imagem
function addImageEvents(imgElement, dog) {
    imgElement.addEventListener('click', () => showDetails(dog));
    imgElement.addEventListener('mousedown', () => {
        timer = setTimeout(() => toggleFavorite(dog.name, imgElement), 1000);
    });
    imgElement.addEventListener('mouseup', () => clearTimeout(timer));
    imgElement.addEventListener('mouseleave', () => clearTimeout(timer));
}

// Função para buscar dados e imagens da API
async function fetchDogs() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Erro ao buscar dados da API');
        dogs = await response.json();
        
        // Salva a lista de raças no localStorage
        localStorage.setItem('dogs', JSON.stringify(dogs));
        
        displayDogs(dogs);
    } catch (error) {
        console.error('Erro:', error);
    }
}

async function fetchImage(referenceId) {
    try {
        const response = await fetch(`https://api.thedogapi.com/v1/images/${referenceId}`);
        const imageData = await response.json();
        return imageData.url;
    } catch {
        return 'https://via.placeholder.com/200';
    }
}

// Função para exibir os cães
async function displayDogs(dogArray) {
    dogListContainer.innerHTML = '';
    await Promise.all(dogArray.map(async (dog) => {
        const imgUrl = await fetchImage(dog.reference_image_id);
        const dogItem = document.createElement('div');
        dogItem.innerHTML = `
            <img src="${imgUrl}" alt="${dog.name}" data-name="${dog.name}" />
            <p>${dog.name}</p>`;
        const imgElement = dogItem.querySelector('img');
        if (favorites.includes(dog.name)) imgElement.classList.add('favorite');
        addImageEvents(imgElement, dog);
        dogListContainer.appendChild(dogItem);
    }));
}

// Função para exibir detalhes
function showDetails(dog) {
    alert(`Raça: ${dog.name}\nOrigem: ${dog.origin || 'Desconhecida'}\nTemperamento: ${dog.temperament || 'Informação de temperamento não disponível.'}`);
    detailsContainer.innerHTML = `
        <h2>${dog.name}</h2>
        <p>Origem: ${dog.origin || 'Desconhecida'}</p>
        <p>${dog.temperament || 'Informação de temperamento não disponível.'}</p>`;
}

// Função para adicionar/remover favoritos
function toggleFavorite(dogName, imgElement) {
    const isFavorite = favorites.includes(dogName);
    favorites = isFavorite ? favorites.filter(fav => fav !== dogName) : [...favorites, dogName];
    imgElement.classList.toggle('favorite', !isFavorite);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Filtrar raças na barra de pesquisa
filterInput.addEventListener('input', () => {
    const filterValue = filterInput.value.toLowerCase();
    displayDogs(dogs.filter(dog => dog.name.toLowerCase().includes(filterValue)));
});

fetchDogs();
