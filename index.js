const GOT_API_URL = "https://thronesapi.com/api/v2/Characters";

async function fetchCharacters() {
    try {
        const response = await fetch(GOT_API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error("Failed to fetch characters:", error);
        return [];
    }
}

function renderCharacterCard(char) {
    const { id, firstName, lastName, fullName, title, family, imageUrl } = char;
    return `
      <div class="char-card">
        <img class="char-img" src="${imageUrl}" alt="${fullName}">
        <div class="char-info">
            <h2 class="char-name">${fullName}</h2>
            <p class="char-title">${title}</p>
            <p class="char-family">${family}</p>
        </div>
      </div>
    `;
}

class GotGalleryApp {
    constructor() {
        this.allCharacters = [];
        this.displayedCharacters = [];
        this.init();
    }
    async init() {
        this.allCharacters = await fetchCharacters();
        this.displayedCharacters = [...this.allCharacters];
        this.render();
        this.setupListeners();
    }
    render() {
        const grid = document.getElementById('character-grid');
        const counter = document.getElementById('results-count');
        if (counter) {
            counter.textContent = ` ${this.displayedCharacters.length.toString()} résultats`;
        }
        const html = this.displayedCharacters.map(char => renderCharacterCard(char)).join('');
        if (grid) {
            grid.innerHTML = html;
        }
    }
    setupListeners() {
        const selectFamily = document.getElementById("filter-family");
        const searchInput = document.getElementById("search-name");
        const handleFilter = () => {
            if (!searchInput || !selectFamily) return;
            const query = searchInput.value.toLowerCase().trim();
            const selectedFamily = selectFamily.value;
            this.displayedCharacters = this.allCharacters.filter(char => {
                const matchesName = char.fullName.toLowerCase().includes(query);
                const matchesFamily = selectedFamily === 'all' || char.family.includes(selectedFamily);
                return matchesName && matchesFamily;
            });
            this.render();
        };
        if (searchInput) {
            searchInput.addEventListener("input", handleFilter);
        }
        if (selectFamily) {
            selectFamily.addEventListener("change", handleFilter);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GotGalleryApp();
});

export {};
