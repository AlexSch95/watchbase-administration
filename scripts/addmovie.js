import { showFeedback, logout, checkAuth } from "./sharedFunctions.js";

let genres = [];
let actors = [];
const selectedGenres = [];
const selectedActors = [];

async function initApp() {
  const isAuthed = await checkAuth();
  if (!isAuthed) {
    return;
  }
  getGenresAndActors();
}

initApp();

//Elemente
const genreDropdown = document.getElementById("genreSelect");
const actorDropdown = document.getElementById("actorInput");
const modal = new bootstrap.Modal(document.getElementById("movieModal"));

//Event-Listener
document.getElementById("logout")?.addEventListener("click", logout);
document.getElementById("addGenre").addEventListener("click", selectionHandler("genreSelect", selectedGenres, "selectedGenres", "genres"));
document.getElementById("addActor").addEventListener("click", selectionHandler("actorInput", selectedActors, "selectedActors", "actors"));

function selectionHandler(selectId, array, storageKey, type) {
  return () => {
    const select = document.getElementById(selectId);
    const selectedOption = select.options[select.selectedIndex];

    if (selectedOption?.value && !array.includes(selectedOption.value)) {
      array.push(selectedOption.value);
      updateSelectedItems(storageKey, array, type);
      select.value = "";
    }
  };
}

// Event Delegation für beide Container
function handleContainerClick(e) {
  if (!e.target.classList.contains("remove-item")) return;

  const container = e.currentTarget;
  const index = parseInt(e.target.dataset.index);
  
  // Mapping von Container-IDs zu den entsprechenden Arrays und hiddenInput-IDs
  const containerConfig = {
    "selectedGenres": {
      array: selectedGenres,
      hiddenInputId: "genres"
    },
    "selectedActors": {
      array: selectedActors,
      hiddenInputId: "actors"
    }
  };

  const config = containerConfig[container.id];
  if (config) {
    config.array.splice(index, 1);
    updateSelectedItems(container.id, config.array, config.hiddenInputId);
  }
}

document
  .getElementById("selectedGenres")
  .addEventListener("click", handleContainerClick);
document
  .getElementById("selectedActors")
  .addEventListener("click", handleContainerClick);

// Aktualisierungsfunktion
function updateSelectedItems(containerId, items, hiddenInputId) {
  const container = document.getElementById(containerId);
  const hiddenInput = document.getElementById(hiddenInputId);

  container.innerHTML = items
    .map(
      (item, index) => `
          <div class="selected-item d-inline-block w-auto text-nowrap">
              ${item}
              <span class="remove-item" data-index="${index}">&times;</span>
          </div>
      `
    )
    .join("");

  hiddenInput.value = JSON.stringify(items);
}

async function getGenresAndActors() {
  try {
    const token = localStorage.getItem("jwttoken");
    const responseGenres = await fetch(
      "http://localhost:3000/api/genres/get-all",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const responseActors = await fetch(
      "http://localhost:3000/api/actors/get-all",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!responseGenres.ok || !responseActors.ok) {
      throw new Error(
        `HTTP Error: ${responseGenres.status} und ${responseActors.status}`
      );
    }
    const genresFromApi = await responseGenres.json();
    const actorsFromApi = await responseActors.json();
    actors = actorsFromApi.data;
    genres = genresFromApi.data;
    fillGenresAndActors(genres, actors);
  } catch (error) {
    console.log("Genres und Schauspieler konnten nicht geladen werden", error);
  }
}

function fillGenresAndActors(genres, actors) {
  genres.forEach((genre) => {
    const filterEntry = document.createElement("option");
    filterEntry.value = genre.genre_name;
    filterEntry.innerHTML = `${genre.genre_name}`;
    genreDropdown.appendChild(filterEntry);
    // <option value="Drama">Drama</option>
  });
  actors.forEach((actor) => {
    const filterEntry = document.createElement("option");
    filterEntry.value = actor.actor_name;
    filterEntry.innerHTML = `${actor.actor_name}`;
    actorDropdown.appendChild(filterEntry);
  });
}

document.getElementById("movieForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const movieTitleInput = document.getElementById("filmTitle").value;
  const movieDirectorInput = document.getElementById("director").value;
  const movieRatingInput = document.getElementById("rating").value;
  const movieYearInput = document.getElementById("releaseYear").value;
  const movieDescriptionInput = document.getElementById("description").value;
  const movieTrailerInput = document.getElementById("trailerUrl").value;
  const moviePosterInput = document.getElementById("posterUrl").value;
  const submittedMovie = {
    title: movieTitleInput,
    release_year: movieYearInput,
    director: movieDirectorInput,
    short_description: movieDescriptionInput,
    trailer_url: movieTrailerInput,
    poster: moviePosterInput,
    rating: movieRatingInput,
    genres: selectedGenres,
    actors: selectedActors,
  };
  previewSubmittedMovie(submittedMovie);
});

function previewSubmittedMovie(submittedMovie) {
  const exampleCardContainer = document.getElementById("movieCardPreview");
  exampleCardContainer.innerHTML = "";
  const colCard = document.createElement("div");
  colCard.className = "col-md-4 mb-4 mx-auto";
  colCard.innerHTML = `
    <div class="card-movie-preview h-100" data-id="1">
        <img src="${submittedMovie.poster}" class="card-img-top" alt="${
    submittedMovie.title
  }" />
        <div class="card-body">
            <h5 class="movie-title">${submittedMovie.title}</h5>
            <p class="movie-meta">
                <span class="rating">${generateStars(submittedMovie.rating)} ${
    submittedMovie.rating
  }</span> |
                <span class="year">${submittedMovie.release_year}</span>
            </p>
        </div>
    </div>
        `;
  colCard.addEventListener("click", () => openMovieModal(submittedMovie));
  exampleCardContainer.appendChild(colCard);
  const pushToDbButton = document.createElement("button");
  pushToDbButton.className = "btn btn-danger d-inline-block mx-auto";
  pushToDbButton.innerHTML = "Film Abspeichern";
  console.log(submittedMovie);
  pushToDbButton.addEventListener("click", () => addMovie(submittedMovie));
  exampleCardContainer.appendChild(pushToDbButton);
}

async function addMovie(submittedMovie) {
  try {
    const token = localStorage.getItem("jwttoken");
    const response = await fetch("http://localhost:3000/api/movies/add", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submittedMovie),
    });
    const responseBody = await response.json();
    showFeedback(responseBody)
    setTimeout(() => {
      window.location.href = "./addmovie.html";
    },5000);
  } catch (error) {
    console.error(error.message);
  }
}

function openMovieModal(movie) {
  document.getElementById("movieModalLabel").textContent = movie.title;
  document.getElementById("movieDescription").textContent = movie.short_Description;
  document.getElementById("movieDirector").textContent = movie.director;
  document.getElementById("movieGenres").textContent = movie.genres.join(", ");
  document.getElementById("movieActors").textContent = movie.actors.join(", ");
  document.getElementById("movieTrailer").src = movie.trailer_url;
  modal.show();
}

function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 10 - fullStars - (halfStar ? 1 : 0);

  return "★".repeat(fullStars) + (halfStar ? "⯪" : "") + "☆".repeat(emptyStars);
}
