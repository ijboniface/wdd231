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

export function esc(value = "") {
  return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", "\"": "&quot;" }[char]));
}

export function filmPoster(film) {
  const year = film.year || (film.status === "Upcoming" ? "Upcoming" : "—");
  const alt = `${esc(film.title)} film artwork`;
  if (film.posterUrl) {
    return `<div class="poster poster-original">
      <img src="${esc(film.posterUrl)}" alt="${alt}" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.closest('.poster').classList.add('poster-image-error');this.remove()">
      <div class="poster-overlay"></div>
      <span class="poster-label">${esc(film.country)} · ${year}</span>
      <div class="poster-credit">${film.posterSource && film.posterSource.toLowerCase().includes("thumbnail") ? "Official video artwork" : "Film artwork"}</div>
      <div class="poster-fallback-title">${esc(film.title)}</div>
    </div>`;
  }
  return `<div class="poster poster-unavailable" role="img" aria-label="Representative artwork for ${esc(film.title)}; original cover not verified">
    <span class="poster-label">${esc(film.country)} · ${year}</span>
    <div class="poster-fallback-title">${esc(film.title)}</div>
    <small>Representative artwork · original cover not verified</small>
  </div>`;
}

export function tagList(items = []) {
  return items.slice(0, 3).map(item => `<span class="tag">${esc(item)}</span>`).join("");
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
  const direct = film.watchUrl;
  const channel = film.channelUrl;
  if (direct) return `<a class="text-btn story-link story-link-youtube" href="${direct}" target="_blank" rel="noopener noreferrer"><span>Watch film ↗</span><small>YouTube · direct link</small></a>`;
  if (channel) return `<a class="text-btn story-link story-link-youtube" href="${channel}" target="_blank" rel="noopener noreferrer"><span>Find film on channel ↗</span><small>${film.channelName || "YouTube channel"}</small></a>`;
  if (!film.source) return "";
  const youtube = isYouTubeUrl(film.source) || film.sourceType === "official-youtube-channel";
  return `<a class="text-btn story-link ${youtube ? "story-link-youtube" : "story-link-verified"}" href="${esc(film.source)}" target="_blank" rel="noopener noreferrer"><span>${youtube ? "Watch on YouTube ↗" : "Open verified source ↗"}</span><small>${youtube ? "YouTube" : "Verified source"}</small></a>`;
}

export function filmCard(film) {
  const upcoming = film.status === "Upcoming";
  const channelLink = film.watchUrl && film.channelUrl
    ? `<a class="text-btn story-link story-link-youtube" href="${esc(film.channelUrl)}" target="_blank" rel="noopener noreferrer"><span>Production channel ↗</span><small>YouTube</small></a>`
    : "";
  return `<article class="film-card reveal ${upcoming ? "film-upcoming" : ""}">
    ${filmPoster(film)}
    <div class="film-body">
      <span class="eyebrow">${upcoming ? "Coming soon" : (film.era || "Directory")}</span>
      <h3>${esc(film.title)}</h3>
      <div class="film-meta">${tagList([film.country, film.year || "TBA", film.language || ""])}</div>
      <p>${esc(film.description)}</p>
      <div class="card-actions">
        <button class="text-btn details-btn" type="button" data-film="${esc(film.id)}">View film story →</button>
        ${sourceLink(film)}${channelLink}
        <button class="save-btn" type="button" data-save="${esc(film.id)}" aria-label="Save ${esc(film.title)}">＋ Save</button>
      </div>
    </div>
  </article>`;
}

let filmsPromise;

export function loadFilms() {
  if (!filmsPromise) filmsPromise = (async () => {
    const response = await fetch(new URL("../data/films.json", import.meta.url));
    if (!response.ok) throw new Error(`Could not load film data (${response.status})`);
    return response.json();
  })().catch(error => { filmsPromise = undefined; throw error; });
  return filmsPromise;
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

const progress = document.createElement("div");
progress.className = "scroll-progress";
progress.setAttribute("aria-hidden", "true");
document.body.append(progress);

function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
}
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

const revealTargets = ".intro-card, .industry-card, .timeline-item, .story-card, .box-office-metric, .displaced-promo, .filmmaker-profile, .submit-card";
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const watcher = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      watcher.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(revealTargets).forEach((el, index) => {
    el.classList.add("js-reveal");
    el.style.setProperty("--i", index % 4);
    watcher.observe(el);
  });
}

if (window.matchMedia("(hover: hover)").matches) {
  document.addEventListener("pointermove", event => {
    const card = event.target.closest?.(".film-card, .industry-card, .intro-card, .story-card");
    if (!card) return;
    const box = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - box.left}px`);
    card.style.setProperty("--my", `${event.clientY - box.top}px`);
  }, { passive: true });
}

if (!window.gwNav) {
  const navScript = document.createElement("script");
  navScript.src = new URL("./nav.js", import.meta.url).href;
  document.head.append(navScript);
}