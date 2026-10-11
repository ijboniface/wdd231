(function () {
  if (window.gwNav) return;
  window.gwNav = true;
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  function setOpen(open) {
    if (open) links.classList.add("open"); else links.classList.remove("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  toggle.addEventListener("click", function () {
    setOpen(!links.classList.contains("open"));
  });
  links.addEventListener("click", function (event) {
    if (event.target.closest("a")) setOpen(false);
  });
  document.addEventListener("click", function (event) {
    if (!event.target.closest(".nav-wrap")) setOpen(false);
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setOpen(false);
  });

  var icons = {
    "index.html": '<path d="M3 11l9-8 9 8v10h-6v-6H9v6H3z"/>',
    "films.html": '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/>',
    "industries.html": '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    "form.html": '<path d="M12 5v14M5 12h14"/>'
  };
  var labels = { "index.html": "Home", "films.html": "Films", "industries.html": "Regions", "form.html": "Submit" };
  var anchors = links.querySelectorAll("a");
  var html = "";
  for (var i = 0; i < anchors.length; i++) {
    var file = anchors[i].getAttribute("href");
    var current = anchors[i].getAttribute("aria-current") === "page" ? ' aria-current="page"' : "";
    html += '<a href="' + file + '"' + current + '><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + (icons[file] || "") + '</svg><span>' + (labels[file] || anchors[i].textContent) + '</span></a>';
  }
  var bar = document.createElement("nav");
  bar.className = "tab-bar";
  bar.setAttribute("aria-label", "Quick navigation");
  bar.innerHTML = html;
  document.body.appendChild(bar);
})();
