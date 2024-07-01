const containerFilmsSearched = document.querySelector(".movie--searched");
const containerFilmsWatched = document.querySelector(".movie--watched");
const searchForm = document.querySelector(".search__form");
const searchInput = document.querySelector(".search-input");
const mask = document.querySelector(".mask");
const tabs = document.querySelector(".tabs");
const tabsBtnList = Array.from(document.querySelectorAll(".tabs__btn"));
const filmsContainersList = Array.from(
  document.querySelectorAll(".films__container")
);

const url =
  "https:api.themoviedb.org/3/search/movie?api_key=98f92c617ad098219567563b0fd469c0&query=";

const urlImage = "https://image.tmdb.org/t/p/w300_and_h450_bestv2";

const state = {
  films: [],
  watchedFilms: [],
};

searchForm.addEventListener("submit", (event) => {
  containerFilmsSearched.innerHTML = "";
  event.preventDefault();
  getFilms(searchInput.value);
});

tabs.addEventListener("click", toggleActiveTabBtn);

function toggleActiveTabBtn(event) {
  const tabBtn = event.target.closest(".tabs__btn");
  const activeBtn = tabsBtnList.find((element) =>
    element.classList.contains("active")
  );
  if (!tabBtn.classList.contains("active")) {
    activeBtn.classList.remove("active");
    tabBtn.classList.add("active");
  }
  if (activeBtn.classList.contains("tabs__btn--first")) {
    filmsContainersList[0].classList.add("unvisible");
    filmsContainersList[1].classList.remove("unvisible");
    renderWacthFilms(state.watchedFilms);
  } else if (!activeBtn.classList.contains("tabs__btn--first")) {
    filmsContainersList[1].classList.add("unvisible");
    filmsContainersList[0].classList.remove("unvisible");
  }
}

function findUnsibileContainer() {
  const unvisibleContainer = filmsContainersList.find((el) =>
    el.classList.contains("unvisible")
  );
  return unvisibleContainer;
}

async function getFilms(item) {
  try {
    console.log("dsfss");
    mask.classList.add("visible");
    const response = await fetch(`${url}${item}`);
    let json = await response.json();
    const filmsArray = json.results;
    state.films = filmsArray;
    localStorage.setItem("films", JSON.stringify(state.films));
    renderFilms(filmsArray);
  } catch (error) {
    const statusCode = error.response ? error.response.status : "Unknown";
    containerFilmsSearched.innerHTML =
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
    containerFilmsSearched.append(film);
    const watchBtn = film.querySelector(".movie__watch-btn");
    state.films.push(element);
    film.dataset.id = element.id;
    watchBtn.addEventListener("click", (event) => {
      const watchFilm = event.target.closest(".movie");
      const watchedFilmsId = watchFilm.dataset.id;
      const watchFilmObj = state.films.find(
        (obj) => obj.id === parseInt(watchedFilmsId)
      );
      if (!state.watchedFilms.some((obj) => obj.id === watchFilmObj.id)) {
        state.watchedFilms.push(watchFilmObj);
      }
    });
  });
}
function renderWacthFilms(array) {
  const films = array;
  containerFilmsWatched.innerHTML = "";
  films.forEach((element) => {
    const film = createWatchFilm(element);
    containerFilmsWatched.append(film);
    film.dataset.id = element.id;
  });
}
function createWatchFilm(film) {
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
</div>
<button class = "movie__watch-btn">Watch</button>`;

  return movie;
}

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("films") !== null) {
    mask.classList.add("visible");
    const films = JSON.parse(localStorage.getItem("films"));
    renderFilms(films);
    mask.classList.remove("visible");
  }
});
