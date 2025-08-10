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

    document.getElementById('movieForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const submittedGenres = {genres: genresArray}
    pushGenres(submittedGenres);
    });

    async function pushGenres(genres) {
        try {
            console.log(genres);
            const response = await fetch('http://localhost:3000/api/genres/add', {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(genres)
            });
            const responseBody = await response.json();
            showFeedback(responseBody);
        } catch (error) {
            console.error(error);
        }
    }

});

function showFeedback(responseBody) {
  // responseBody dekonstruieren
  const { success, message } = responseBody;
  // Error Alert Elemente Laden
  const errorText = document.getElementById("errorText")
  const errorBox = document.getElementById("errorMessage")
  if (success === true) {
    errorText.textContent = message;
    errorBox.classList.add('alert-success');
  } else if (success === false) {
    errorText.textContent = message;
    errorBox.classList.add('alert-danger')
  }
  errorBox.classList.add('show');
  setTimeout(() => {
      document.getElementById('errorMessage').classList.remove('show');
  }, 8000);
}