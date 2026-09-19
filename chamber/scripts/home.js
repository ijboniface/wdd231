/* =========================================
   CHAMBER HOME PAGE JAVASCRIPT
   ========================================= */


/* =========================================
   OPENWEATHERMAP SETTINGS
   ========================================= */

const WEATHER_API_KEY ='8fc0bc2f48ed74e0eba330adb183708f';


/*
    Ikorodu coordinates
*/
const WEATHER_LAT = 6.6194;
const WEATHER_LON = 3.5105;


/* =========================================
   PAGE INITIALIZATION
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    setFooterInformation();

    loadWeather();

    loadSpotlights();

});


/* =========================================
   FOOTER INFORMATION
   ========================================= */

function setFooterInformation() {

    const currentYear =
        document.querySelector("#current-year");

    const lastModified =
        document.querySelector("#last-modified");


    if (currentYear) {

        currentYear.textContent =
            new Date().getFullYear();

    }


    if (lastModified) {

        lastModified.textContent =
            document.lastModified;

    }

}


/* =========================================
   WEATHER
   ========================================= */

async function loadWeather() {

    const currentWeather =
        document.querySelector("#current-weather");

    const forecast =
        document.querySelector("#forecast");


    if (!currentWeather || !forecast) {

        return;

    }


    /*
        Display a helpful message until
        the student adds their API key.
    */

    if (
    !WEATHER_API_KEY ||
    WEATHER_API_KEY === "YOUR_OPENWEATHERMAP_API_KEY"
    ) {

        currentWeather.innerHTML = `
            <p class="error-message">
                Add your OpenWeatherMap API key
                to scripts/home.js to display
                live weather.
            </p>
        `;


        forecast.innerHTML = `
            <p class="error-message">
                The three-day forecast will appear
                after the API key is configured.
            </p>
        `;

        return;

    }

const currentUrl =
    `https://api.openweathermap.org/data/2.5/weather?lat=${WEATHER_LAT}&lon=${WEATHER_LON}&units=metric&appid=${WEATHER_API_KEY}`;

const forecastUrl =
    `https://api.openweathermap.org/data/2.5/forecast?lat=${WEATHER_LAT}&lon=${WEATHER_LON}&units=metric&appid=${WEATHER_API_KEY}`;


    try {

        const [
            currentResponse,
            forecastResponse
        ] = await Promise.all([

            fetch(currentUrl),

            fetch(forecastUrl)

        ]);


        if (
            !currentResponse.ok ||
            !forecastResponse.ok
        ) {

            throw new Error(
                "Weather service returned an error."
            );

        }


        const [
            currentData,
            forecastData
        ] = await Promise.all([

            currentResponse.json(),

            forecastResponse.json()

        ]);


        displayCurrentWeather(currentData);

        displayThreeDayForecast(forecastData);


    } catch (error) {

        currentWeather.innerHTML = `
            <p class="error-message">
                Weather information is temporarily
                unavailable. Please try again later.
            </p>
        `;


        forecast.innerHTML = "";

    }

}


/* =========================================
   CURRENT WEATHER
   ========================================= */

function displayCurrentWeather(data) {

    const currentWeather =
        document.querySelector("#current-weather");


    const icon =
        data.weather?.[0]?.icon;


    const description =
        data.weather?.[0]?.description ??
        "Weather unavailable";


    const temperature =
        Math.round(data.main?.temp ?? 0);


    currentWeather.innerHTML = `

        ${
            icon
                ? `
                    <img
                        class="weather-icon"
                        src="https://openweathermap.org/img/wn/${icon}@2x.png"
                        alt="${description}"
                        width="90"
                        height="90"
                    >
                `
                : ""
        }

        <div>

            <p class="weather-temperature">
                ${temperature}°C
            </p>

            <p class="weather-description">
                ${description}
            </p>

            <p>
                Ikorodu, Lagos, Nigeria
            </p>

        </div>

    `;

}


/* =========================================
   THREE-DAY FORECAST
   ========================================= */

function displayThreeDayForecast(data) {

    const forecastContainer =
        document.querySelector("#forecast");


    const dailyForecasts = new Map();


    data.list.forEach((item) => {

        const date =
            new Date(item.dt * 1000);


        const dateKey =
            date.toISOString().split("T")[0];


        if (!dailyForecasts.has(dateKey)) {

            dailyForecasts.set(
                dateKey,
                []
            );

        }


        dailyForecasts
            .get(dateKey)
            .push(item);

    });


    /*
        Skip today's data and select
        the next three days.
    */

    const nextThreeDays =
        [...dailyForecasts.values()]
            .slice(1, 4);


    forecastContainer.innerHTML =
        nextThreeDays.map((day) => {


            /*
                Find the forecast closest
                to 12:00 noon.
            */

            const middayForecast =
                day.reduce(
                    (closest, item) => {

                        const hour =
                            new Date(
                                item.dt * 1000
                            ).getHours();


                        const closestHour =
                            new Date(
                                closest.dt * 1000
                            ).getHours();


                        return Math.abs(
                            hour - 12
                        ) < Math.abs(
                            closestHour - 12
                        )
                            ? item
                            : closest;

                    }
                );


            const date =
                new Date(
                    middayForecast.dt * 1000
                );


            const dayName =
                date.toLocaleDateString(
                    "en-NG",
                    {
                        weekday: "short"
                    }
                );


            const temperature =
                Math.round(
                    middayForecast.main.temp
                );


            const description =
                middayForecast.weather?.[0]
                    ?.description ??
                "Unavailable";


            return `

                <article class="forecast-day">

                    <h4>
                        ${dayName}
                    </h4>

                    <p>
                        <strong>
                            ${temperature}°C
                        </strong>
                    </p>

                    <p>
                        ${description}
                    </p>

                </article>

            `;

        }).join("");

}


/* =========================================
   BUSINESS SPOTLIGHTS
   ========================================= */

async function loadSpotlights() {

    const spotlights =
        document.querySelector("#spotlights");


    if (!spotlights) {

        return;

    }


    try {

        /*
            Fetch chamber members from
            the JSON file.
        */

        const response =
            await fetch(
                "data/members.json"
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load member data."
            );

        }


        const data =
            await response.json();


        /*
            Supports either:

            [
                {...},
                {...}
            ]

            OR:

            {
                "members": [...]
            }
        */

        const members =
            Array.isArray(data)
                ? data
                : data.members;


        if (!Array.isArray(members)) {

            throw new Error(
                "Member data is not in the expected format."
            );

        }


        /*
            Only Gold and Silver members.
        */

        const eligibleMembers =
            members.filter((member) => {

                const level =
                    String(
                        member.membershipLevel ??
                        member.membership ??
                        member.level ??
                        ""
                    ).toLowerCase();


                return (
                    level === "gold" ||
                    level === "silver" ||
                    level === "3" ||
                    level === "2"
                );

            });


        /*
            Randomly shuffle the eligible
            members and select three.
        */

        const selectedMembers =
            shuffle(
                [...eligibleMembers]
            ).slice(0, 3);


        if (!selectedMembers.length) {

            throw new Error(
                "No Gold or Silver members were found."
            );

        }


        /*
            Create the spotlight cards.
        */

        spotlights.innerHTML =
            selectedMembers
                .map(createSpotlightCard)
                .join("");


    } catch (error) {

        spotlights.innerHTML = `

            <p class="error-message">

                Member spotlights are temporarily
                unavailable.

            </p>

        `;

    }

}


/* =========================================
   CREATE SPOTLIGHT CARD
   ========================================= */
function createSpotlightCard(member) {

    const name = member.name ?? member.companyName ?? "Chamber Member";
    const phone = member.phone ?? "Phone information unavailable";
    const address = member.address ?? "Address information unavailable";
    const website = member.website ?? member.url ?? "#";

    /* Build the logo path: add "images/" if only a filename was given */
    const logoFile = member.image ?? member.logo ?? "favicon.svg";
    const logoSrc = logoFile.includes("/") ? logoFile : `images/${logoFile}`;

    const rawLevel = String(
        member.membershipLevel ?? member.membership ?? member.level ?? ""
    ).toLowerCase();

    const membership =
        rawLevel === "3" ? "Gold"
        : rawLevel === "2" ? "Silver"
        : rawLevel.charAt(0).toUpperCase() + rawLevel.slice(1);

    return `
        <article class="spotlight">

            <img
                class="spotlight-logo"
                src="${logoSrc}"
                alt="${name} logo"
                width="100"
                height="80"
                loading="lazy"
                onerror="this.onerror=null; this.src='images/favicon.svg';"
            >

            <h3>${name}</h3>

            <span class="membership-level">${membership} Member</span>

            <div class="spotlight-details">
                <span>${phone}</span>
                <span>${address}</span>
                <a href="${website}" target="_blank" rel="noopener noreferrer">
                    Visit website
                </a>
            </div>

        </article>
    `;
}


/* =========================================
   SHUFFLE ARRAY
   ========================================= */

function shuffle(array) {

    for (
        let index = array.length - 1;
        index > 0;
        index--
    ) {

        const randomIndex =
            Math.floor(
                Math.random() *
                (index + 1)
            );


        [
            array[index],
            array[randomIndex]
        ] = [

            array[randomIndex],
            array[index]

        ];

    }


    return array;

}