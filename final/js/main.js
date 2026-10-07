const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.animate(
      [{ transform: "scale(.94)" }, { transform: "scale(1)" }],
      { duration: 180, easing: "ease-out" }
    );
  });
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("a, button");
  if (!target || target.classList.contains("modal-close")) return;
  target.classList.add("is-clicked");
  window.setTimeout(() => target.classList.remove("is-clicked"), 220);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const rect = target.getBoundingClientRect();
  const ripple = document.createElement("span");
  ripple.className = "click-ripple";
  ripple.style.left = `${event.clientX - rect.left}px`;
  ripple.style.top = `${event.clientY - rect.top}px`;
  target.appendChild(ripple);
  window.setTimeout(() => ripple.remove(), 500);
});

export function filmPoster(film) {
  const year = film.year || (film.status === "Upcoming" ? "Upcoming" : "—");
  const alt = `${film.title} original film poster`;
  if (film.posterUrl) {
    return `<div class="poster poster-original">
      <img src="${film.posterUrl}" alt="${alt}" loading="lazy" decoding="async">
      <div class="poster-overlay"></div>
      <span class="poster-label">${film.country} · ${year}</span>
      <div class="poster-credit">${film.posterSource && film.posterSource.includes("thumbnail") ? "Official video artwork" : "Original poster"}</div>
    </div>`;
  }
  return `<div class="poster poster-unavailable" role="img" aria-label="Original poster not yet verified for ${film.title}">
    <span class="poster-label">${film.country} · ${year}</span>
    <div class="poster-fallback-title">${film.title}</div>
    <small>Original poster not yet verified</small>
  </div>`;
}

export function tagList(items = []) {
  return items.slice(0, 3).map(item => `<span class="tag">${item}</span>`).join("");
}

function isYouTubeUrl(url = "") {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    return hostname === "youtube.com" || hostname === "youtu.be" || hostname.endsWith(".youtube.com");
  } catch {
    return false;
  }
}

function sourceLink(film) {
  if (!film.source) return "";
  const youtube = isYouTubeUrl(film.source) || film.sourceType === "official-youtube-channel";
  return `<a class="text-btn story-link ${youtube ? "story-link-youtube" : "story-link-verified"}" href="${film.source}" target="_blank" rel="noopener noreferrer"><span>${youtube ? "Watch on YouTube ↗" : "Open verified source ↗"}</span><small>${youtube ? "YouTube" : "Verified source"}</small></a>`;
}

export function filmCard(film) {
  const upcoming = film.status === "Upcoming";
  const channelLink = film.channelUrl && film.channelUrl !== film.source
    ? `<a class="text-btn story-link story-link-youtube" href="${film.channelUrl}" target="_blank" rel="noopener noreferrer"><span>Production channel ↗</span><small>YouTube</small></a>`
    : "";
  return `<article class="film-card reveal ${upcoming ? "film-upcoming" : ""}">
    ${filmPoster(film)}
    <div class="film-body">
      <span class="eyebrow">${upcoming ? "Coming soon" : (film.era || "Directory")}</span>
      <h3>${film.title}</h3>
      <div class="film-meta">${tagList([film.country, film.year || "TBA", film.language || ""])}</div>
      <p>${film.description}</p>
      <div class="card-actions">
        <button class="text-btn details-btn" type="button" data-film="${film.id}">View film story →</button>
        ${sourceLink(film)}${channelLink}
        <button class="save-btn" type="button" data-save="${film.id}" aria-label="Save ${film.title}">＋ Save</button>
      </div>
    </div>
  </article>`;
}

export async function loadFilms() {
  const dataUrl = new URL("../data/films.json", import.meta.url);
  const response = await fetch(dataUrl);
  if (!response.ok) throw new Error(`Could not load film data (${response.status})`);
  return response.json();
}

export function animateNewCards() {
  document.querySelectorAll(".film-card.reveal").forEach((card, index) => {
    card.animate(
      [{ opacity: 0, transform: "translateY(14px) scale(.985)" },
       { opacity: 1, transform: "translateY(0) scale(1)" }],
      { duration: 420, delay: Math.min(index * 45, 300), easing: "cubic-bezier(.2,.8,.2,1)", fill: "both" }
    );
  });
}
