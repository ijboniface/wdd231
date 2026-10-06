
import { loadFilms, filmCard } from "./main.js";
import { setupModal } from "./modal.js";

try {
  const films = await loadFilms();
  document.querySelector("#featured-films").innerHTML = films.filter(f => f.featured).slice(0, 6).map(filmCard).join("");
  setupModal(films);
} catch (error) {
  console.error(error);
  document.querySelector("#featured-films").innerHTML = `<div class="empty">Featured films could not be loaded right now.</div>`;
}
