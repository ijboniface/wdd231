import { loadFilms, filmCard } from "./main.js";
import { setupModal } from "./modal.js";

try {
  const films = await loadFilms();
  const featured = films.filter(f => f.featured);
  const felix = films.filter(f => (f.director || []).some(name => name.toLowerCase().includes("felix bankole")));
  const otherFeatured = featured.filter(f => !felix.includes(f));

  const featuredEl = document.querySelector("#featured-films");
  if (featuredEl) {
    const selection = otherFeatured.slice(0, 6);
    featuredEl.innerHTML = selection.map(filmCard).join("");
  }

  const felixEl = document.querySelector("#felix-featured-films");
  if (felixEl) felixEl.innerHTML = felix.map(filmCard).join("");

  setupModal(films);
} catch (error) {
  console.error(error);
  const featuredEl = document.querySelector("#featured-films");
  if (featuredEl) featuredEl.innerHTML = `<div class="empty">Featured films could not be loaded right now.</div>`;
}
