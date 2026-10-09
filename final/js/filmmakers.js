import { loadFilms } from "./main.js";

const profileHost = document.querySelector("#filmmaker-profile");
const previous = document.querySelector("#filmmaker-prev");
const next = document.querySelector("#filmmaker-next");
let profiles = [];
let films = [];
let active = 0;
let timer = null;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function getCredits(profile) {
  const explicit = new Set(profile.filmIds || []);
  const match = (profile.match || "").toLowerCase();
  const productionMatch = (profile.productionMatch || "").toLowerCase();
  return films.filter(film => explicit.has(film.id)
    || (match && (film.director || []).some(name => String(name).toLowerCase().includes(match) || match.includes(String(name).toLowerCase())))
    || (productionMatch && String(film.production || "").toLowerCase().includes(productionMatch)));
}

function renderProfile() {
  const profile = profiles[active];
  if (!profile || !profileHost) return;
  const credits = getCredits(profile);
  const productionList = (profile.productions || []).filter(Boolean);
  const filmographyCount = Math.max(credits.length, (profile.filmography || []).length);
  const initials = profile.name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase();
  const portrait = profile.imageUrl
    ? `<img class="filmmaker-portrait" src="${profile.imageUrl}" alt="${profile.imageAlt || `Portrait of ${profile.name}`}" loading="lazy" referrerpolicy="no-referrer" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><div class="filmmaker-monogram" hidden aria-hidden="true">${initials}</div>`
    : `<div class="filmmaker-monogram" aria-hidden="true">${initials}</div>`;
  profileHost.innerHTML = `<div class="filmmaker-visual">${portrait}<span class="portrait-caption">${profile.imageUrl ? "Filmmaker portrait" : "Profile image not verified"}</span></div><div class="filmmaker-copy"><span class="eyebrow">${profile.country || "Africa"} · ${profile.role || "Film contributor"}</span><h3>${profile.name}</h3><p class="filmmaker-organization">${profile.organization || "Production credits in the Gospelwood directory"}</p><p>${profile.history}</p><div class="profile-credit-line"><strong>Filmography / production collection:</strong> ${(profile.filmography || []).length} listed title${(profile.filmography || []).length === 1 ? "" : "s"}${productionList.length ? ` · ${productionList.length} production credit${productionList.length === 1 ? "" : "s"}` : ""}</div><div class="filmmaker-links"><a class="btn btn-primary" href="${profile.channelUrl || profile.sourceUrl}" target="_blank" rel="noopener noreferrer">Visit channel / source ↗</a><a class="text-btn" href="${profile.sourceUrl}" target="_blank" rel="noopener noreferrer">${profile.sourceLabel || "View source"} ↗</a></div></div><div class="filmmaker-count"><strong>${active + 1}<span class="count-divider">/</span>${profiles.length}</strong><span>Contributor spotlight</span><small>${filmographyCount} matching directory records</small></div>`;
  profileHost.animate?.([{ opacity: .45, transform: "translateY(6px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: reducedMotion.matches ? 0 : 320, easing: "ease-out" });
}

function move(step) {
  if (!profiles.length) return;
  active = (active + step + profiles.length) % profiles.length;
  renderProfile();
  restart();
}
function stop() { if (timer) clearInterval(timer); timer = null; }
function restart() {
  stop();
  if (reducedMotion.matches || profiles.length < 2) return;
  timer = window.setInterval(() => { active = (active + 1) % profiles.length; renderProfile(); }, 8000);
}

try {
  const [profileResponse, loadedFilms] = await Promise.all([
    fetch(new URL("../data/filmmakers.json", import.meta.url)),
    loadFilms()
  ]);
  if (!profileResponse.ok) throw new Error(`Could not load filmmaker profiles (${profileResponse.status})`);
  profiles = await profileResponse.json();
  films = loadedFilms;
  renderProfile();
  previous?.addEventListener("click", () => move(-1));
  next?.addEventListener("click", () => move(1));
  profileHost?.addEventListener("mouseenter", stop);
  profileHost?.addEventListener("mouseleave", restart);
  profileHost?.addEventListener("focusin", stop);
  profileHost?.addEventListener("focusout", event => { if (!profileHost.contains(event.relatedTarget)) restart(); });
  document.addEventListener("visibilitychange", () => document.hidden ? stop() : restart());
  restart();
} catch (error) {
  console.error(error);
  if (profileHost) profileHost.innerHTML = `<div class="error-box">Filmmaker profiles could not be loaded. Please refresh the page.</div>`;
}
