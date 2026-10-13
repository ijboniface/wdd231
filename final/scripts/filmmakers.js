(function () {
  if (window.gospelwoodFilmmakers) return;
  window.gospelwoodFilmmakers = true;

  var host = document.querySelector("#filmmaker-profile");
  var previous = document.querySelector("#filmmaker-prev");
  var next = document.querySelector("#filmmaker-next");
  if (!host) return;

  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var profiles = [];
  var films = [];
  var active = 0;
  var timer = null;

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>'"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c];
    });
  }

  function initials(name) {
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map(function (p) { return p[0]; }).join("").toUpperCase();
  }

  function creditCount(profile) {
    var ids = profile.filmIds || [];
    var match = (profile.match || "").toLowerCase();
    var production = (profile.productionMatch || "").toLowerCase();
    return films.filter(function (film) {
      var byDirector = match && (film.director || []).some(function (n) { return String(n).toLowerCase().indexOf(match) !== -1; });
      var byProduction = production && String(film.production || "").toLowerCase().indexOf(production) !== -1;
      return ids.indexOf(film.id) !== -1 || byDirector || byProduction;
    }).length;
  }

  function monogram(profile) {
    var el = document.createElement("div");
    el.className = "filmmaker-monogram";
    el.setAttribute("aria-hidden", "true");
    el.textContent = initials(profile.name);
    return el;
  }

  function buildVisual(profile) {
    var visual = document.createElement("div");
    visual.className = "filmmaker-visual";
    var caption = document.createElement("span");
    caption.className = "portrait-caption";
    if (profile.imageUrl) {
      var img = new Image();
      var retried = false;
      img.className = "filmmaker-portrait";
      img.alt = profile.imageAlt || "Portrait of " + profile.name;
      img.width = 220;
      img.height = 250;
      img.decoding = "async";
      img.referrerPolicy = "no-referrer";
      img.onerror = function () {
        if (profile.imageFallbackUrl && !retried) { retried = true; img.src = profile.imageFallbackUrl; return; }
        if (img.parentNode) img.parentNode.replaceChild(monogram(profile), img);
        caption.textContent = "Profile image not verified";
      };
      img.src = profile.imageUrl;
      caption.textContent = "Filmmaker portrait";
      visual.appendChild(img);
    } else {
      visual.appendChild(monogram(profile));
      caption.textContent = "Profile image not verified";
    }
    visual.appendChild(caption);
    return visual;
  }

  function render(animate) {
    var profile = profiles[active];
    if (!profile) return;
    var listed = (profile.filmography || []).length;
    var productions = (profile.productions || []).filter(Boolean).length;
    var matches = Math.max(creditCount(profile), listed);
    var link = profile.channelUrl || profile.sourceUrl;
    var wrap = document.createElement("div");
    wrap.innerHTML =
      '<div class="filmmaker-copy">' +
        '<span class="eyebrow">' + esc(profile.country || "Africa") + " · " + esc(profile.role || "Film contributor") + "</span>" +
        "<h3>" + esc(profile.name) + "</h3>" +
        '<p class="filmmaker-organization">' + esc(profile.organization || "Production credits in the Gospelwood directory") + "</p>" +
        "<p>" + esc(profile.history) + "</p>" +
        '<div class="profile-credit-line"><strong>Filmography:</strong> ' + listed + " listed title" + (listed === 1 ? "" : "s") + (productions ? " · " + productions + " production credit" + (productions === 1 ? "" : "s") : "") + "</div>" +
        '<div class="filmmaker-links">' +
          '<a class="action action-main" href="' + esc(link) + '" target="_blank" rel="noopener noreferrer">Visit channel or source ↗</a>' +
          '<a class="text-link" href="' + esc(profile.sourceUrl) + '" target="_blank" rel="noopener noreferrer">' + esc(profile.sourceLabel || "View source") + " ↗</a>" +
        "</div>" +
      "</div>" +
      '<div class="filmmaker-count"><strong>' + (active + 1) + '<span class="count-divider">/</span>' + profiles.length + "</strong><span>Contributor spotlight</span><small>" + matches + " matching directory records</small></div>";
    host.innerHTML = "";
    host.appendChild(buildVisual(profile));
    while (wrap.firstChild) host.appendChild(wrap.firstChild);
    if (animate && !reduced && host.animate) {
      host.animate([{ opacity: 0.4, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], { duration: 340, easing: "ease-out" });
    }
  }

  function stop() { window.clearInterval(timer); timer = null; }
  function restart() {
    stop();
    if (reduced || profiles.length < 2) return;
    timer = window.setInterval(function () { move(1, false); }, 8000);
  }
  function move(step, reset) {
    if (!profiles.length) return;
    active = (active + step + profiles.length) % profiles.length;
    render(true);
    if (reset !== false) restart();
  }

  function showError() {
    host.innerHTML = '<div class="error-box"><p>Filmmaker profiles could not be loaded.</p><button class="action action-main" type="button" id="filmmaker-retry">Try again</button></div>';
    document.querySelector("#filmmaker-retry").addEventListener("click", start);
  }

  function start() {
    fetch("data/filmmakers.json")
      .then(function (response) {
        if (!response.ok) throw new Error("Could not load filmmaker profiles (" + response.status + ")");
        return response.json();
      })
      .then(function (list) {
        profiles = list;
        render(true);
        restart();
        return fetch("data/films.json").then(function (r) { return r.json(); }).then(function (f) { films = f; render(false); });
      })
      .catch(function (error) {
        console.error(error);
        if (!profiles.length) showError();
      });
  }

  if (previous) previous.addEventListener("click", function () { move(-1); });
  if (next) next.addEventListener("click", function () { move(1); });
  host.addEventListener("mouseenter", stop);
  host.addEventListener("mouseleave", restart);
  document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); else restart(); });
  start();
})();