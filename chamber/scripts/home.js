const WEATHER_API_KEY = "8fc0bc2f48ed74e0eba330adb183708f";
const WEATHER_LAT = 6.6194;
const WEATHER_LON = 3.5105;

document.addEventListener("DOMContentLoaded", () => {
    setFooter();
    setEventDates();
    loadWeather();
    loadSpotlights();
});

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

// keeps the events upcoming: 1, 2 and 4 weeks from today
function setEventDates() {
    const offsets = [7, 14, 28];

    document.querySelectorAll(".event-date").forEach((box, index) => {
        const date = new Date();
        date.setDate(date.getDate() + (offsets[index] ?? 7 * (index + 1)));

        const day = String(date.getDate()).padStart(2, "0");
        const month = date.toLocaleDateString("en-US", { month: "short" }).toUpperCase();

        box.innerHTML = `<span>${day}</span><small>${month}</small>`;
    });
}

async function loadWeather() {
    const currentWeather = document.querySelector("#current-weather");
    const forecast = document.querySelector("#forecast");

    if (!currentWeather || !forecast) {
        return;
    }

    if (!WEATHER_API_KEY || WEATHER_API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") {
        currentWeather.innerHTML = `<p class="error">Add your OpenWeatherMap API key to scripts/home.js to show the weather.</p>`;
        forecast.innerHTML = "";
        return;
    }

    const query = `lat=${WEATHER_LAT}&lon=${WEATHER_LON}&units=metric&appid=${WEATHER_API_KEY}`;

    try {
        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(`https://api.openweathermap.org/data/2.5/weather?${query}`),
            fetch(`https://api.openweathermap.org/data/2.5/forecast?${query}`)
        ]);

        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error("The weather service returned an error.");
        }

        showCurrentWeather(await currentResponse.json());
        showForecast(await forecastResponse.json());
    } catch (error) {
        console.error("Weather error:", error);
        currentWeather.innerHTML = `<p class="error">Weather information is not available right now. Please try again later.</p>`;
        forecast.innerHTML = "";
    }
}

function showCurrentWeather(data) {
    const icon = data.weather?.[0]?.icon;
    const description = data.weather?.[0]?.description ?? "Weather unavailable";
    const temperature = Math.round(data.main?.temp ?? 0);

    document.querySelector("#current-weather").innerHTML = `
        ${icon ? `<img class="weather-icon" src="https://openweathermap.org/img/wn/${icon}@2x.png"
            alt="${description}" width="90" height="90">` : ""}
        <div>
            <p class="weather-temperature">${temperature}°C</p>
            <p class="weather-description">${description}</p>
            <p>Ikorodu, Lagos, Nigeria</p>
        </div>`;
}

// the forecast comes in 3-hour steps, so group them by date,
// skip today and use the step closest to midday for each of the next three days
function showForecast(data) {
    const today = new Date().toISOString().slice(0, 10);
    const days = new Map();

    data.list.forEach((item) => {
        const date = item.dt_txt.slice(0, 10);

        if (date !== today) {
            days.set(date, [...(days.get(date) ?? []), item]);
        }
    });

    const hourOf = (item) => Number(item.dt_txt.slice(11, 13));

    document.querySelector("#forecast").innerHTML = [...days.values()]
        .slice(0, 3)
        .map((day, index) => {
            const midday = day.reduce((best, item) =>
                Math.abs(hourOf(item) - 12) < Math.abs(hourOf(best) - 12) ? item : best
            );

            const dayName = new Date(midday.dt * 1000).toLocaleDateString("en-NG", {
                weekday: "short",
                timeZone: "UTC"
            });

            const description = midday.weather?.[0]?.description ?? "Unavailable";

            return `
                <article class="forecast-day" style="--i:${index}">
                    <h4>${dayName}</h4>
                    <p><strong>${Math.round(midday.main.temp)}°C</strong></p>
                    <p>${description}</p>
                </article>`;
        })
        .join("");
}

async function loadSpotlights() {
    const spotlights = document.querySelector("#spotlights");

    if (!spotlights) {
        return;
    }

    try {
        const response = await fetch("data/members.json");

        if (!response.ok) {
            throw new Error("Unable to load member data.");
        }

        const data = await response.json();
        const members = Array.isArray(data) ? data : data.members;

        if (!Array.isArray(members)) {
            throw new Error("Member data is not in the expected format.");
        }

        const goldAndSilver = members.filter((member) => ["Gold", "Silver"].includes(getLevelName(member)));
        const chosen = shuffle([...goldAndSilver]).slice(0, 3);

        if (!chosen.length) {
            throw new Error("No Gold or Silver members were found.");
        }

        spotlights.innerHTML = chosen.map(createSpotlight).join("");
    } catch (error) {
        console.error("Spotlight error:", error);
        spotlights.innerHTML = `<p class="error">Member spotlights are not available right now.</p>`;
    }
}

function getLevelName(member) {
    const level = String(member.membershipLevel ?? member.membership ?? member.level ?? "").toLowerCase();

    if (level === "3" || level === "gold") {
        return "Gold";
    }

    if (level === "2" || level === "silver") {
        return "Silver";
    }

    return "Member";
}

function createSpotlight(member, index) {
    const name = member.name ?? member.companyName ?? "Chamber Member";
    const phone = member.phone ?? "Phone unavailable";
    const address = member.address ?? "Address unavailable";
    const website = member.website ?? member.url ?? "#";

    const logoFile = member.image ?? member.logo ?? "favicon.svg";
    const logo = logoFile.includes("/") ? logoFile : `images/${logoFile}`;

    return `
        <article class="member-card" style="--i:${index}">
            <div class="member-heading">
                <h3>${name}</h3>
                <p>${getLevelName(member)} Member</p>
            </div>

            <div class="member-content">
                <img src="${logo}" alt="${name} logo" width="105" height="85" loading="lazy"
                    onerror="this.onerror=null; this.src='images/favicon.svg';">

                <div class="member-details">
                    <p><strong>PHONE:</strong> <a href="tel:${String(phone).replace(/[^\d+]/g, "")}">${phone}</a></p>
                    <p><strong>ADDRESS:</strong> ${address}</p>
                    <p><a href="${website}" target="_blank" rel="noopener noreferrer">Visit Website</a></p>
                </div>
            </div>
        </article>`;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}