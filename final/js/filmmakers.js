import { loadFilms, esc } from "./main.js";

const host = document.querySelector("#filmmaker-profile");
const previous = document.querySelector("#filmmaker-prev");
const next = document.querySelector("#filmmaker-next");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let profiles = [];
let films = [];
let active = 0;
let timer = null;

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getCredits(profile) {
  const explicit = new Set(profile.filmIds || []);
  const match = (profile.match || "").toLowerCase();
  const production = (profile.productionMatch || "").toLowerCase();
  return films.filter(
    (film) =>
      explicit.has(film.id) ||
      (match &&
        (film.director || []).some((name) =>
          String(name).toLowerCase().includes(match),
        )) ||
      (production &&
        String(film.production || "")
          .toLowerCase()
          .includes(production)),
  );
}

function buildVisual(profile) {
  const visual = document.createElement("div");
  visual.className = "filmmaker-visual";
  const caption = document.createElement("span");
  caption.className = "portrait-caption";

  const monogram = () => {
    const el = document.createElement("div");
    el.className = "filmmaker-monogram";
    el.setAttribute("aria-hidden", "true");
    el.textContent = initials(profile.name);
    return el;
  };

  if (profile.imageUrl) {
    const img = new Image();
    img.className = "filmmaker-portrait";
    img.alt = profile.imageAlt || `Portrait of ${profile.name}`;
    img.decoding = "async";
    img.referrerPolicy = "no-referrer";
    let triedFallback = false;
    img.addEventListener("error", () => {
      if (profile.imageFallbackUrl && !triedFallback) {
        triedFallback = true;
        img.src = profile.imageFallbackUrl;
        return;
      }
      img.replaceWith(monogram());
      caption.textContent = "Profile image not verified";
    });
    img.src = profile.imageUrl;
    caption.textContent = "Filmmaker portrait";
    visual.append(img, caption);
  } else {
    caption.textContent = "Profile image not verified";
    visual.append(monogram(), caption);
  }
  return visual;
}

function renderProfile(animate = true) {
  const profile = profiles[active];
  if (!profile || !host) return;
  const credits = getCredits(profile);
  const listed = (profile.filmography || []).length;
  const productions = (profile.productions || []).filter(Boolean).length;
  const matches = Math.max(credits.length, listed);
  const link = profile.channelUrl || profile.sourceUrl;

  const markup = document.createElement("template");
  markup.innerHTML = `
    <div class="filmmaker-copy">
      <span class="eyebrow">${esc(profile.country || "Africa")} · ${esc(profile.role || "Film contributor")}</span>
      <h3>${esc(profile.name)}</h3>
      <p class="filmmaker-organization">${esc(profile.organization || "Production credits in the Gospelwood directory")}</p>
      <p>${esc(profile.history)}</p>
      <div class="profile-credit-line"><strong>Filmography:</strong> ${listed} listed title${listed === 1 ? "" : "s"}${productions ? ` · ${productions} production credit${productions === 1 ? "" : "s"}` : ""}</div>
      <div class="filmmaker-links">
        <a class="btn btn-primary" href="${esc(link)}" target="_blank" rel="noopener noreferrer">Visit channel or source ↗</a>
        <a class="text-btn" href="${esc(profile.sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(profile.sourceLabel || "View source")} ↗</a>
      </div>
    </div>
    <div class="filmmaker-count"><strong>${active + 1}<span class="count-divider">/</span>${profiles.length}</strong><span>Contributor spotlight</span><small>${matches} matching directory records</small></div>`;
  host.replaceChildren(buildVisual(profile), markup.content);

  if (animate && !reducedMotion.matches) {
    host.animate(
      [
        { opacity: 0.4, transform: "translateY(8px)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 340, easing: "ease-out" },
    );
  }
}

function stop() {
  window.clearInterval(timer);
  timer = null;
}

function restart() {
  stop();
  if (reducedMotion.matches || profiles.length < 2) return;
  timer = window.setInterval(() => move(1, false), 8000);
}

function move(step, reset = true) {
  if (!profiles.length) return;
  active = (active + step + profiles.length) % profiles.length;
  renderProfile();
  if (reset) restart();
}

function showError() {
  if (!host) return;
  host.innerHTML = `<div class="error-box"><p>Filmmaker profiles could not be loaded.</p><button class="btn btn-primary" type="button" id="filmmaker-retry">Try again</button></div>`;
  host.querySelector("#filmmaker-retry").addEventListener("click", start);
}

async function start() {
  try {
    const response = await fetch(
      new URL("../data/filmmakers.json", import.meta.url),
    );
    if (!response.ok)
      throw new Error(`Could not load filmmaker profiles (${response.status})`);
    profiles = await response.json();
  } catch (error) {
    console.error(error);
    showError();
    return;
  }
  renderProfile();
  restart();
  loadFilms()
    .then((list) => {
      films = list;
      renderProfile(false);
    })
    .catch((error) => console.error(error));
}

if (!window.gospelwoodFilmmakers) {
  window.gospelwoodFilmmakers = true;
  previous?.addEventListener("click", () => move(-1));
  next?.addEventListener("click", () => move(1));
  host?.addEventListener("mouseenter", stop);
  host?.addEventListener("mouseleave", restart);
  host?.addEventListener("focusin", stop);
  host?.addEventListener("focusout", (event) => {
    if (!host.contains(event.relatedTarget)) restart();
  });
  document.addEventListener("visibilitychange", () =>
    document.hidden ? stop() : restart(),
  );
  start();
}
