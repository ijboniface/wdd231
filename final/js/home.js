import { loadFilms, filmCard, animateNewCards } from "./main.js";
import { setupModal } from "./modal.js";

let featuredTimer = null;

function startFeaturedCarousel(items) {
  const host = document.querySelector("#featured-films");
  if (!host || items.length < 2) return;

  let offset = 0;
  const visibleCount = () => window.innerWidth >= 1000 ? 3 : window.innerWidth >= 700 ? 2 : 1;

  const render = () => {
    const count = Math.min(visibleCount(), items.length);
    const shown = Array.from({ length: count }, (_, i) => items[(offset + i) % items.length]);
    host.innerHTML = shown.map(filmCard).join("");
    animateNewCards();
  };

  const advance = () => {
    offset = (offset + 1) % items.length;
    render();
  };

  render();

  const start = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    clearInterval(featuredTimer);
    featuredTimer = window.setInterval(advance, 4200);
  };
  const stop = () => clearInterval(featuredTimer);

  host.addEventListener("mouseenter", stop);
  host.addEventListener("mouseleave", start);
  host.addEventListener("focusin", stop);
  host.addEventListener("focusout", (event) => {
    if (!host.contains(event.relatedTarget)) start();
  });
  window.addEventListener("resize", render);
  start();
}

try {
  const films = await loadFilms();
  const featured = films.filter(f => f.featured);
  const felix = films.filter(f => (f.director || []).some(name => name.toLowerCase().includes("felix bankole")));
  const otherFeatured = featured.filter(f => !felix.includes(f));

  startFeaturedCarousel(otherFeatured);

  const felixEl = document.querySelector("#felix-featured-films");
  if (felixEl) {
    felixEl.innerHTML = felix.map(filmCard).join("");
    animateNewCards();
  }

  setupModal(films);
} catch (error) {
  console.error(error);
  const featuredEl = document.querySelector("#featured-films");
  if (featuredEl) featuredEl.innerHTML = `<div class="empty">Featured films could not be loaded right now.</div>`;
}
