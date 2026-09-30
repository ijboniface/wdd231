import { discoverItems }
    from "../data/discover.mjs";

document.addEventListener(
    "DOMContentLoaded",
    () => {

        displayDiscoverItems();

        displayVisitorMessage();

        setFooterInformation();

    }
);


function displayDiscoverItems() {

    const container =
        document.querySelector(
            "#discover-grid"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    discoverItems.forEach(
        (item) => {

            const card =
                document.createElement(
                    "article"
                );


            card.classList.add(
                "discover-card"
            );


            card.dataset.area =
                `card-${item.id}`;


            card.innerHTML = `

                <h2>
                    ${item.name}
                </h2>


                <figure>

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                        width="300"
                        height="200"
                        loading="lazy">

                    <figcaption>
                        ${item.name}
                    </figcaption>

                </figure>


                <address>
                    ${item.address}
                </address>


                <p>
                    ${item.description}
                </p>


                <button
                    type="button"
                    class="learn-more"
                    aria-label="Learn more about ${item.name}"
                    data-id="${item.id}">

                    Learn More

                </button>

            `;


            container.appendChild(
                card
            );

        }
    );


    setupLearnMoreButtons();

}


function setupLearnMoreButtons() {

    const buttons =
        document.querySelectorAll(
            ".learn-more"
        );


    buttons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const card =
                        button.closest(
                            ".discover-card"
                        );


                    if (!card) {
                        return;
                    }


                    card.classList.toggle(
                        "expanded"
                    );


                    if (
                        card.classList.contains(
                            "expanded"
                        )
                    ) {

                        button.textContent =
                            "Show Less";

                    } else {

                        button.textContent =
                            "Learn More";

                    }

                }
            );

        }
    );

}

function displayVisitorMessage() {

    const messageElement =
        document.querySelector(
            "#visitor-message"
        );


    if (!messageElement) {
        return;
    }


    const storageKey =
        "ikorodu-discover-last-visit";


    const currentTime =
        Date.now();


    const previousVisit =
        localStorage.getItem(
            storageKey
        );


    let message;


    if (!previousVisit) {

        message =
            "Welcome! Let us know if you have any questions.";

    }


    else {

        const previousTime =
            Number(previousVisit);


        const difference =
            currentTime - previousTime;


        const millisecondsInDay =
            1000 *
            60 *
            60 *
            24;


        const days =
            Math.floor(
                difference /
                millisecondsInDay
            );


        if (days < 1) {

            message =
                "Back so soon! Awesome!";

        } else if (days === 1) {

            message =
                "You last visited 1 day ago.";

        } else {

            message =
                `You last visited ${days} days ago.`;

        }

    }


    messageElement.textContent =
        message;


    /*
        Save the current visit after
        calculating the previous visit.
    */

    localStorage.setItem(
        storageKey,
        currentTime.toString()
    );

}


function setFooterInformation() {

    const currentYear =
        document.querySelector(
            "#current-year"
        );


    const lastModified =
        document.querySelector(
            "#last-modified"
        );


    if (currentYear) {

        currentYear.textContent =
            new Date().getFullYear();

    }


    if (lastModified) {

        lastModified.textContent =
            document.lastModified;

    }

}
