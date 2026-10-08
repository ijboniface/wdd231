import { discoverItems } from "../data/discover.mjs";

document.addEventListener("DOMContentLoaded", () => {
    showPlaces();
    showVisitorMessage();
    setFooter();
});

function showPlaces() {
    const container = document.querySelector("#discover-grid");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    discoverItems.forEach((item, index) => {
        const card = document.createElement("article");
        card.classList.add("discover-card");
        card.style.gridArea = `card-${item.id}`;
        card.style.setProperty("--i", index);

        card.innerHTML = `
            <h2>${item.name}</h2>

            <figure>
                <div class="image-frame">
                    <img src="${item.image}" alt="${item.alt ?? `Photo of ${item.name}, Ikorodu`}"
                        width="300" height="200" loading="lazy">
                </div>
            </figure>

            <address>${item.address}</address>

            <p>${item.description}</p>

            <button type="button" class="learn-more" data-url="${item.url}"
                aria-label="Learn more about ${item.name} (opens in a new tab)">
                Learn More
            </button>`;

        container.appendChild(card);
    });

    // each button opens the page about its place
    container.querySelectorAll(".learn-more").forEach((button) => {
        button.addEventListener("click", () => {
            window.open(button.dataset.url, "_blank", "noopener,noreferrer");
        });
    });
}

function showVisitorMessage() {
    const messageElement = document.querySelector("#visitor-message");

    if (!messageElement) {
        return;
    }

    const storageKey = "ikorodu-discover-last-visit";
    const oneDay = 1000 * 60 * 60 * 24;
    const now = Date.now();

    let lastVisit = null;

    try {
        lastVisit = Number(localStorage.getItem(storageKey)) || null;
    } catch (error) {
        lastVisit = null;
    }

    let message = "Welcome! Let us know if you have any questions.";

    if (lastVisit) {
        const days = Math.floor((now - lastVisit) / oneDay);

        if (days < 1) {
            message = "Back so soon! Awesome!";
        } else {
            message = `You last visited ${days} ${days === 1 ? "day" : "days"} ago.`;
        }
    }

    messageElement.textContent = message;
    messageElement.classList.add("show");

    // save this visit after the old one has been read
    try {
        localStorage.setItem(storageKey, String(now));
    } catch (error) {
        // nothing to save to, the message above is still right for this visit
    }
}

function setFooter() {
    const currentYear = document.querySelector("#current-year");
    const lastModified = document.querySelector("#last-modified");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    if (lastModified) {
        lastModified.textContent = document.lastModified;
    }
}