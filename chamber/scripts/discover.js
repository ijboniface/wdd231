import { discoverItems } from "../data/discover.mjs";


document.addEventListener("DOMContentLoaded", () => {

    displayDiscoverItems();

    displayVisitorMessage();

    setFooterInformation();

});


/* =========================================
   CARDS
   ========================================= */

function displayDiscoverItems() {

    const container = document.querySelector("#discover-grid");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    discoverItems.forEach((item, index) => {

        const card = document.createElement("article");

        card.classList.add("discover-card");

        // the named grid area for this card (see discover.css)
        card.style.gridArea = `card-${item.id}`;

        // staggers the load animation
        card.style.setProperty("--i", index);

        card.innerHTML = `
            <h2>${item.name}</h2>

            <figure>
                <div class="image-frame">
                    <img
                        src="${item.image}"
                        alt="${item.alt ?? `Photo of ${item.name}, Ikorodu`}"
                        width="300"
                        height="200"
                        loading="lazy"
                    >
                </div>
            </figure>

            <address>${item.address}</address>

            <p>${item.description}</p>

            <button
                type="button"
                class="learn-more"
                aria-expanded="false"
                aria-label="Learn more about ${item.name}"
            >
                Learn More
            </button>
        `;

        container.appendChild(card);
    });

    setupLearnMoreButtons();
}


function setupLearnMoreButtons() {

    document.querySelectorAll(".learn-more").forEach((button) => {

        button.addEventListener("click", () => {

            const card = button.closest(".discover-card");

            const isExpanded = card.classList.toggle("expanded");

            button.setAttribute("aria-expanded", isExpanded);

            button.textContent = isExpanded ? "Show Less" : "Learn More";
        });
    });
}


/* =========================================
   VISITOR MESSAGE (localStorage)
   ========================================= */

function displayVisitorMessage() {

    const messageElement = document.querySelector("#visitor-message");

    if (!messageElement) {
        return;
    }

    const storageKey = "ikorodu-discover-last-visit";
    const millisecondsInDay = 1000 * 60 * 60 * 24;
    const currentTime = Date.now();

    // storage can be blocked (private browsing), so every access is guarded
    let previousTime = null;

    try {
        previousTime = Number(localStorage.getItem(storageKey)) || null;
    } catch (error) {
        previousTime = null;
    }

    let message = "Welcome! Let us know if you have any questions.";

    if (previousTime) {

        const days = Math.floor((currentTime - previousTime) / millisecondsInDay);

        if (days < 1) {
            message = "Back so soon! Awesome!";
        } else {
            message = `You last visited ${days} ${days === 1 ? "day" : "days"} ago.`;
        }
    }

    messageElement.textContent = message;

    messageElement.classList.add("show");

    // save this visit only after the previous one has been read
    try {
        localStorage.setItem(storageKey, String(currentTime));
    } catch (error) {
        // nothing to do: the message above is still correct for this visit
    }
}


/* =========================================
   FOOTER
   ========================================= */

function setFooterInformation() {

    const currentYear = document.querySelector("#current-year");
    const lastModified = document.querySelector("#last-modified");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    if (lastModified) {
        lastModified.textContent = document.lastModified;
    }
}