import { showFeedback, logout, checkAuth } from './sharedFunctions.js';

async function initApp() {
    const isAuthed = await checkAuth();
    if (!isAuthed) {
        return;
    }
}

initApp();

const genreSelect = document.getElementById('genreSelect');
const addGenreBtn = document.getElementById('addGenre');
const selectedGenresContainer = document.getElementById('selectedGenres');

let genresArray = [];

document.getElementById('logout')?.addEventListener('click', logout);

document.getElementById('genreForm').addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && event.target.tagName !== 'TEXTAREA') {
        event.preventDefault();
        document.getElementById('addGenre').click()
    }
});

addGenreBtn.addEventListener('click', function() {
    const genre = genreSelect.value.trim();
    if (genre && !genresArray.includes(genre)) {
        genresArray.push(genre);
        genreSelect.value = ''; // Input leeren
        updateSelectedGenresDisplay();
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
    document.querySelectorAll('.remove-item').forEach(span => {
        span.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            genresArray.splice(index, 1);
            updateSelectedGenresDisplay();
        });
    });
}

document.getElementById('genreForm').addEventListener('submit', function(e) {
e.preventDefault();
const submittedGenres = genresArray
pushGenres(submittedGenres);
});

async function pushGenres(genres) {
    try {
        console.log(genres);
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
        showFeedback({success: false, message: "Verbindungsfehler..."})
    }
}