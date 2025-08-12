import { showFeedback, logout } from './sharedFunctions.js';

document.getElementById('logout')?.addEventListener('click', logout);

document.getElementById('actorForm').addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && event.target.tagName !== 'TEXTAREA') {
        event.preventDefault();
        document.getElementById('addActor').click()
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const actorSelect = document.getElementById('actorSelect');
    const addActorBtn = document.getElementById('addActor');
    const selectedActorsContainer = document.getElementById('selectedActors');
    const hiddenActorsInput = document.getElementById('actors');
    
    let actorsArray = [];
    
    // Lade gespeicherte Actors falls vorhanden
    if (hiddenActorsInput.value) {
        actorsArray = JSON.parse(hiddenActorsInput.value);
        updateSelectedActorsDisplay();
    }
    
    // Füge Actor hinzu
    addActorBtn.addEventListener('click', function() {
        const actor = actorSelect.value.trim();
        
        if (actor && !actorsArray.includes(actor)) {
            actorsArray.push(actor);
            actorSelect.value = ''; // Input leeren
            updateSelectedActorsDisplay();
            updateHiddenInput();
        }
    });
    
    // Enter-Taste unterstützen
    actorSelect.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addActorBtn.click();
        }
    });
    
    // Aktualisiere die Anzeige der ausgewählten Actors
    function updateSelectedActorsDisplay() {
        selectedActorsContainer.innerHTML = '';
        
        actorsArray.forEach((actor, index) => {
            const actorItem = document.createElement('div');
            actorItem.className = 'selected-item d-inline-block w-auto text-nowrap';
            
            actorItem.innerHTML = `
                ${actor}
                <span class="remove-item" data-index="${index}">&times;</span>
            `;
            
            selectedActorsContainer.appendChild(actorItem);
        });
        
        // Füge Event-Listener für Löschen hinzu
        document.querySelectorAll('.remove-item').forEach(span => {
            span.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                actorsArray.splice(index, 1);
                updateSelectedActorsDisplay();
                updateHiddenInput();
            });
        });
    }
    
    // Aktualisiere das versteckte Input-Feld
    function updateHiddenInput() {
        hiddenActorsInput.value = JSON.stringify(actorsArray);
    }

    document.getElementById('actorForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const submittedActors = {actors: actorsArray}
        pushActors(submittedActors);
    });

    async function pushActors(actors) {
        try {
            const token = localStorage.getItem("jwttoken");
            const response = await fetch('http://localhost:3000/api/actors/add', {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(actors)
            });
            const responseBody = await response.json();
            showFeedback(responseBody);
        } catch (error) {
            console.error(error);
        }
    }
});
