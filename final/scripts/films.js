import { loadFilms, filmCard, animateNewCards } from "./main.js";
import { setupModal } from "./modal.js";
import { toggleSaved, isSaved } from "./storage.js";

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
const PAGE = 12;
let limit = PAGE;
let lastKey = "";
const more = document.createElement("button");
more.type = "button";
more.className = "action action-alt more-films";
more.textContent = "Show more films";
more.hidden = true;
grid?.after(more);
more.addEventListener("click", () => { limit += PAGE; render(); });

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

  const key = [q, selectedCountry, selectedYear, selectedGenre, selectedStatus, onlySaved].join("|");
  if (key !== lastKey) { limit = PAGE; lastKey = key; }

  const filtered = films.filter(f => {
    const haystack = [f.title, ...(f.director || []), f.production, f.channelName, f.country, f.language, ...(f.genre || []), ...(f.themes || [])].join(" ").toLowerCase();
    return (!q || haystack.includes(q))
      && (!selectedCountry || f.country === selectedCountry)
      && (!selectedYear || String(f.year) === selectedYear)
      && (!selectedGenre || (f.genre || []).includes(selectedGenre))
      && (!selectedStatus || f.status === selectedStatus)
      && (!onlySaved || isSaved(f.id));
  });

  const shown = filtered.slice(0, limit);
  if (grid) grid.innerHTML = shown.map(filmCard).join("");
  more.hidden = shown.length >= filtered.length;
  if (count) count.textContent = `${filtered.length} film${filtered.length === 1 ? "" : "s"} found${shown.length < filtered.length ? `, showing ${shown.length}` : ""}`;
  empty?.classList.toggle("is-hidden", filtered.length !== 0);
  animateNewCards();

  grid?.querySelectorAll("[data-save]").forEach(saveButton => {
    const film = films.find(f => f.id === saveButton.dataset.save);
    if (!film) return;
    saveButton.textContent = isSaved(film.id) ? "✓ Saved" : "＋ Save";
    saveButton.addEventListener("click", () => {
      toggleSaved(film.id);
      saveButton.textContent = isSaved(film.id) ? "✓ Saved" : "＋ Save";
      if (savedOnly?.checked) render();
    });
  });
}

(async function init() {
try {
  films = await loadFilms();
  fillFilters();
  const params = new URLSearchParams(location.search);
  if (params.get("search") && search) search.value = params.get("search");
  setupModal(films);
  render();
  [search, country, year, genre, status, savedOnly].forEach(el => el?.addEventListener("input", render));
  document.querySelector("#search-button")?.addEventListener("click", render);
  document.querySelector("#clear-search")?.addEventListener("click", () => { search.value = ""; country.value = ""; year.value = ""; genre.value = ""; status.value = ""; savedOnly.checked = false; render(); search.focus(); });
  search?.addEventListener("keydown", event => { if (event.key === "Enter") render(); });
} catch (error) {
  console.error(error);
  if (grid) grid.innerHTML = `<div class="error-box"><strong>We couldn't load the directory.</strong><p>Please refresh the page and try again.</p></div>`;
}
})();