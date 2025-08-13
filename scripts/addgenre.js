import { showFeedback, logout, checkAuth } from './sharedFunctions.js';

async function initApp() {
    const isAuthed = await checkAuth();
    if (!isAuthed) {
        return;
    }
    getRowCounts();
}

initApp();

document.getElementById('logout')?.addEventListener('click', logout);

document.getElementById('genreForm').addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && event.target.tagName !== 'TEXTAREA') {
        event.preventDefault();
        document.getElementById('addGenre').click()
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const genreSelect = document.getElementById('genreSelect');
    const addGenreBtn = document.getElementById('addGenre');
    const selectedGenresContainer = document.getElementById('selectedGenres');
    const hiddenGenresInput = document.getElementById('genres');
    
    let genresArray = [];
    
    // Lade gespeicherte Genres falls vorhanden
    if (hiddenGenresInput.value) {
        genresArray = JSON.parse(hiddenGenresInput.value);
        updateSelectedGenresDisplay();
    }
    
    // Füge Genre hinzu
    addGenreBtn.addEventListener('click', function() {
        const genre = genreSelect.value.trim();
        
        if (genre && !genresArray.includes(genre)) {
            genresArray.push(genre);
            genreSelect.value = ''; // Input leeren
            updateSelectedGenresDisplay();
            updateHiddenInput();
        }
    });
    
    // Enter-Taste unterstützen
    genreSelect.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addGenreBtn.click();
        }
    });
    
    // Aktualisiere die Anzeige der ausgewählten Genres
    function updateSelectedGenresDisplay() {
        selectedGenresContainer.innerHTML = '';
        
        genresArray.forEach((genre, index) => {
            const genreItem = document.createElement('div');
            genreItem.className = 'selected-item d-inline-block w-auto text-nowrap';
            
            genreItem.innerHTML = `
                ${genre}
                <span class="remove-item" data-index="${index}">&times;</span>
            `;
            
            selectedGenresContainer.appendChild(genreItem);
        });
        
        // Füge Event-Listener für Löschen hinzu
        document.querySelectorAll('.remove-item').forEach(span => {
            span.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                genresArray.splice(index, 1);
                updateSelectedGenresDisplay();
                updateHiddenInput();
            });
        });
    }
    
    // Aktualisiere das versteckte Input-Feld
    function updateHiddenInput() {
        hiddenGenresInput.value = JSON.stringify(genresArray);
    }

    document.getElementById('genreForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const submittedGenres = {genres: genresArray}
    pushGenres(submittedGenres);
    });

    async function pushGenres(genres) {
        try {
            const token = localStorage.getItem("jwttoken");
            const response = await fetch('http://localhost:3000/api/genres/add', {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(genres)
            });
            const responseBody = await response.json();
            showFeedback(responseBody);
        } catch (error) {
            console.error(error);
        }
    }

});