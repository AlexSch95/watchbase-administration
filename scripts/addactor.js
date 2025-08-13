// Importieren von geteilten funktionen
import { showFeedback, logout, checkAuth } from './sharedFunctions.js';

async function initApp() {
    const isAuthed = await checkAuth();
    if (!isAuthed) {
        return;
    }
}

initApp();

// HTML Elemente definieren
const actorSelect = document.getElementById('actorSelect');
const addActorBtn = document.getElementById('addActor');
const selectedActorsContainer = document.getElementById('selectedActors');

//Lokales Array zur zwischenspeicherung der ausgewählten Schauspieler
let actorsArray = [];

//Logout Navbar-Item
document.getElementById('logout')?.addEventListener('click', logout);

//ermöglicht mit Enter bei der eingabe eines schauspielers die auswahl zu bestätigen (nur qol)
document.getElementById('actorForm').addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && event.target.tagName !== 'TEXTAREA') {
        event.preventDefault();
        document.getElementById('addActor').click()
    }
});

// Schauspieler zum lokalen Array hinzufügen, das beim Abschicken ans Backend geschickt wird
addActorBtn.addEventListener('click', function() {
    const actor = actorSelect.value.trim();
    
    if (actor && !actorsArray.includes(actor)) {
        actorsArray.push(actor);
        actorSelect.value = ''; // Input leeren
        updateSelectedActorsDisplay();
    }
});

// Aktualisiere die Anzeige der ausgewählten Schauspieler (unter der Eingabezeile)
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
    
    // Eventlistener für die ausgewählten Schauspieler zum löschen
    document.querySelectorAll('.remove-item').forEach(span => {
        span.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            actorsArray.splice(index, 1);
            updateSelectedActorsDisplay();
        });
    });
}

document.getElementById('actorForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const submittedActors = actorsArray
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
        showFeedback({success: false, message: "Verbindungsfehler..."})
    }
}

