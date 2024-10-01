const favoritesListContainer = document.getElementById('favoritesList');
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let dogs = JSON.parse(localStorage.getItem('dogs')) || [];

// Função para buscar a imagem do cão
async function fetchImage(referenceId) {
    try {
        const response = await fetch(`https://api.thedogapi.com/v1/images/${referenceId}`);
        const imageData = await response.json();
        return imageData.url;
    } catch {
        return 'https://via.placeholder.com/200';
    }
}

// Função para exibir a lista de favoritos
async function displayFavorites() {
    if (favorites.length === 0) {
        favoritesListContainer.innerHTML += '<p>Nenhum favorito selecionado. Para adicionar um cão aos favoritos, mantenha pressionado o clique sobre a foto do cão desejado por 1 segundo.</p>';
    } else {
        await Promise.all(favorites.map(async (favoriteName) => {
            const dog = dogs.find(d => d.name === favoriteName);
            const imgUrl = await fetchImage(dog.reference_image_id);
            const favoriteItem = document.createElement('div');
            favoriteItem.innerHTML = `
                <img src="${imgUrl}" alt="${dog.name}" data-name="${dog.name}" />
                <p>${dog.name}</p>`;
            favoritesListContainer.appendChild(favoriteItem);
        }));
    }
}

displayFavorites();
