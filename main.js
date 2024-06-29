const containerFilms = document.querySelector(".movies");
const searchForm = document.querySelector(".search__form");
const searchInput = document.querySelector(".search-input");
const mask = document.querySelector(".mask");

const url =
  "https:api.themoviedb.org/3/search/movie?api_key=98f92c617ad098219567563b0fd469c0&query=";

const urlImage = "https://image.tmdb.org/t/p/w300_and_h450_bestv2";

const state = {
  films: "",
};

searchForm.addEventListener("submit", (event) => {
  containerFilms.innerHTML = "";
  event.preventDefault();
  getFilms(searchInput.value);
});

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("films") !== null) {
    mask.classList.add("visible");
    const films = JSON.parse(localStorage.getItem("films"));
    renderFilms(films);
    mask.classList.remove("visible");
  }
});

async function getFilms(item) {
  try {
    mask.classList.add("visible");
    const response = await fetch(`${url}${item}`);
    let json = await response.json();
    const filmsArray = json.results;
    state.films = filmsArray;
    localStorage.setItem("films", JSON.stringify(state.films));
    renderFilms(filmsArray);
  } catch (error) {
    const statusCode = error.response ? error.response.status : "Unknown";
    containerFilms.innerHTML =
      "Error (status code: " + statusCode + "): " + error.message;
    console.log(statusCode);
  } finally {
    mask.classList.remove("visible");
  }
}

function renderFilms(item) {
  const films = item;
  films.forEach((element) => {
    const film = createMovie(element);
    containerFilms.append(film);
  });
}

function createMovie(film) {
  const movie = document.createElement("div");
  movie.classList.add("movie");
  movie.innerHTML = `<img src='${urlImage}${film.poster_path}'
    alt="movie.original_title" class="movie-img" />
<div>
    <div class="movie-name">
        ${film.original_title}
    </div>
    <span class="movie-overview">${film.overview}</span>
</div>`;
  return movie;
}
