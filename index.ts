export {};

// L'URL de l'API gratuite contenant les personnages de GoT
const GOT_API_URL = "https://thronesapi.com/api/v2/Characters";

type house = "Maison Stark" | "Maison Lannister" | "Maison Targaryen" | "Maison Baratheon" | "Maison Greyjoy" | "Maison Martell" | "Maison Tyrell" | "Maison Arryn" | "Maison Tully" | "Maison Frey" | "Maison Bolton" | "Maison Mormont" | "Maison Clegane" | "Maison Hightower" | "Maison Dayne" | "Maison Seaworth" | "Maison Tarly" | "Maison Umber" | "Maison Karstark" | "Maison Blackwood" | "Maison Bracken" | "Maison Royce";
// 1. Définis ton interface Character ici en fonction des données de l'API
// Astuce : L'API renvoie des objets avec : id, firstName, lastName, fullName, title, family, imageUrl
interface Character {
    // À toi de jouer : écris les propriétés et leurs types
    id: number;
    firstName: string;
    lastName: string;
    fullName: string;
    title: string;
    family: string;
    imageUrl: string;
}

// 2. Écris la fonction asynchrone pour fetcher les données
async function fetchCharacters(): Promise<Character[]> {
    // Bloc try / catch et fetch() à faire ici...
    try{
        const response = await fetch(GOT_API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data:Character[] = await response.json();
        return data;
    }
    catch (error) {
        console.error("Failed to fetch characters:", error);
        return [];
    }
}

// 3. Écris la fonction de rendu qui retourne le HTML d'une carte
function renderCharacterCard(char: Character): string {

    const { id,firstName,lastName,fullName,title,family,imageUrl} = char
    // Utilise les classes : 'char-card', 'char-img', 'char-info', 'char-name', 'char-title', 'char-family'
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

// 4. Ta classe principale pour piloter l'application
class GotGalleryApp {
    // Déclare tes tableaux privés (allCharacters et displayedCharacters)
    private allCharacters: Character[] = [];
    private displayedCharacters: Character[] = [];

    constructor() {
        // Sélectionne tes éléments du DOM et lance l'initialisation
        this.init();
    }

    // Méthode d'initialisation (fetch + premier rendu + événements)
    private async init(): Promise<void> {
        this.allCharacters = await fetchCharacters();
        this.displayedCharacters =[...this.allCharacters]; // Copie de allCharacters
        this.render();
        this.setupListeners();
    }

    // Méthode de rendu dans la grille HTML + mise à jour du compteur
    public render(): void {
        const grid = document.getElementById('character-grid') as HTMLElement;
        const counter = document.getElementById('results-count');
      
       if (counter){

        counter.textContent = ` ${this.displayedCharacters.length.toString()} résultats`;
       }

       const html = this.displayedCharacters.map(char => renderCharacterCard(char)).join('');
      
       grid.innerHTML = html;   
    }

    // Méthode pour écouter les inputs de recherche et de sélection
   // Méthode pour écouter les inputs de recherche et de sélection
    private setupListeners(): void {
        const selectFamily = document.getElementById("filter-family") as HTMLSelectElement;
        const searchInput = document.getElementById("search-name") as HTMLInputElement;

        // On crée une fonction commune qui s'exécute dès qu'un des deux filtres bouge
        const handleFilter = () => {
            const query = searchInput.value.toLowerCase().trim();
            const selectedFamily = selectFamily.value; // 'all', 'Stark', 'Lannister', etc.

            this.displayedCharacters = this.allCharacters.filter(char => {
                // 1. Vérification du nom (Est-ce que le nom contient ce qui est tapé ?)
                const matchesName = char.fullName.toLowerCase().includes(query);

                // 2. Vérification de la famille
                // Si 'all' est sélectionné, on accepte tout. Sinon, on compare avec char.family
                const matchesFamily = selectedFamily === 'all' || char.family.includes(selectedFamily);

                // On garde le personnage uniquement si les DEUX conditions sont vraies
                return matchesName && matchesFamily;
            });

            // Une fois le filtrage fait, on redessine la grille !
            this.render();
        };

        // On applique cette fonction aux deux événements séparément
        if (searchInput) {
            searchInput.addEventListener("input", handleFilter);
        }
        if (selectFamily) {
            selectFamily.addEventListener("change", handleFilter);
        }
    }
}

// Lancement au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    new GotGalleryApp();
});