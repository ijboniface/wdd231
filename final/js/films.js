import { loadFilms, filmCard, animateNewCards } from "./main.js";
import { openFilmModal } from "./modal.js";
import { saveFilm, isSaved } from "./storage.js";

const grid = document.querySelector("#film-grid");
const search = document.querySelector("#search");
const country = document.querySelector("#country");
const year = document.querySelector("#year");
const genre = document.querySelector("#genre");
const status = document.querySelector("#status");
const savedOnly = document.querySelector("#saved-only");
const empty = document.querySelector("#empty-state");
const count = document.querySelector("#results-status");
let films = [];

function addOptions(select, values) {
  values.forEach(value => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select?.append(option);
  });
}

function fillFilters() {
  const countries = [...new Set(films.map(f => f.country).filter(Boolean))].sort();
  const years = [...new Set(films.map(f => f.year).filter(Boolean))].sort((a, b) => Number(b) - Number(a));
  const genres = [...new Set(films.flatMap(f => f.genre || []))].sort();
  addOptions(country, countries);
  addOptions(year, years);
  addOptions(genre, genres);
}

function render() {
  const q = (search?.value || "").toLowerCase().trim();
  const selectedCountry = country?.value || "";
  const selectedYear = year?.value || "";
  const selectedGenre = genre?.value || "";
  const selectedStatus = status?.value || "";
  const onlySaved = Boolean(savedOnly?.checked);

  const filtered = films.filter(f => {
    const haystack = [f.title, ...(f.director || []), f.country, f.language, ...(f.genre || []), ...(f.themes || [])].join(" ").toLowerCase();
    return (!q || haystack.includes(q))
      && (!selectedCountry || f.country === selectedCountry)
      && (!selectedYear || String(f.year) === selectedYear)
      && (!selectedGenre || (f.genre || []).includes(selectedGenre))
      && (!selectedStatus || f.status === selectedStatus)
      && (!onlySaved || isSaved(f.id));
  });

  if (grid) grid.innerHTML = filtered.length ? filtered.map(filmCard).join("") : "";
  if (count) count.textContent = `${filtered.length} film${filtered.length === 1 ? "" : "s"} found`;
  empty?.classList.toggle("hidden", filtered.length !== 0);
  animateNewCards();

  grid?.querySelectorAll("[data-film]").forEach(btn => btn.addEventListener("click", () => {
    const film = films.find(f => f.id === btn.dataset.film);
    if (film) openFilmModal(film);
  }));

  grid?.querySelectorAll("[data-save]").forEach(btn => {
    const film = films.find(f => f.id === btn.dataset.save);
    if (!film) return;
    btn.textContent = isSaved(film.id) ? "✓ Saved" : "＋ Save";
    btn.addEventListener("click", () => {
      saveFilm(film.id);
      btn.textContent = isSaved(film.id) ? "✓ Saved" : "＋ Save";
      if (savedOnly?.checked) render();
    });
  });
}

try {
  films = await loadFilms();
  fillFilters();
  const params = new URLSearchParams(location.search);
  if (params.get("search")) search.value = params.get("search");
  render();
  [search, country, year, genre, status, savedOnly].forEach(el => el?.addEventListener("input", render));
  [country, year, genre, status].forEach(el => el?.addEventListener("change", render));
} catch (error) {
  console.error(error);
  if (grid) grid.innerHTML = `<div class="error-box"><strong>We couldn't load the directory.</strong><p>Please refresh the page and try again.</p></div>`;
}
