import { loadFilms, filmCard, animateNewCards } from "./main.js";
import { openFilmModal } from "./modal.js";
import { saveFilm, isSaved } from "./storage.js";

const grid = document.querySelector("#film-grid");
const search = document.querySelector("#search");
const country = document.querySelector("#country-filter");
const genre = document.querySelector("#genre-filter");
const status = document.querySelector("#status-filter");
const empty = document.querySelector("#empty-state");
const count = document.querySelector("#result-count");

let films = [];

function fillFilters() {
  const countries = [...new Set(films.map(f => f.country).filter(Boolean))].sort();
  const genres = [...new Set(films.flatMap(f => f.genre || []))].sort();
  countries.forEach(v => country?.insertAdjacentHTML("beforeend", `<option value="${v}">${v}</option>`));
  genres.forEach(v => genre?.insertAdjacentHTML("beforeend", `<option value="${v}">${v}</option>`));
}

function render() {
  const q = (search?.value || "").toLowerCase().trim();
  const selectedCountry = country?.value || "";
  const selectedGenre = genre?.value || "";
  const selectedStatus = status?.value || "";

  const filtered = films.filter(f => {
    const haystack = [f.title, ...(f.director || []), f.country, f.language, ...(f.genre || []), ...(f.themes || [])].join(" ").toLowerCase();
    return (!q || haystack.includes(q))
      && (!selectedCountry || f.country === selectedCountry)
      && (!selectedGenre || (f.genre || []).includes(selectedGenre))
      && (!selectedStatus || f.status === selectedStatus);
  });

  if (grid) grid.innerHTML = filtered.map(filmCard).join("");
  if (count) count.textContent = `${filtered.length} film${filtered.length === 1 ? "" : "s"} found`;
  empty?.classList.toggle("hidden", filtered.length !== 0);
  animateNewCards();

  grid?.querySelectorAll("[data-film]").forEach(btn => {
    btn.addEventListener("click", () => {
      const film = films.find(f => f.id === btn.dataset.film);
      if (film) openFilmModal(film);
    });
  });

  grid?.querySelectorAll("[data-save]").forEach(btn => {
    const film = films.find(f => f.id === btn.dataset.save);
    if (!film) return;
    btn.textContent = isSaved(film.id) ? "✓ Saved" : "＋ Save";
    btn.addEventListener("click", () => {
      saveFilm(film.id);
      btn.textContent = isSaved(film.id) ? "✓ Saved" : "＋ Save";
    });
  });
}

try {
  films = await loadFilms();
  fillFilters();
  render();
  [search, country, genre, status].forEach(el => el?.addEventListener("input", render));
} catch (error) {
  console.error(error);
  if (grid) grid.innerHTML = `<div class="error-box"><strong>We couldn't load the directory.</strong><p>Please refresh the page and try again.</p></div>`;
}
