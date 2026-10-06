/* =========================================
   CHAMBER HOME PAGE JAVASCRIPT
   ========================================= */

/* OpenWeatherMap settings (Ikorodu) */

const WEATHER_API_KEY = "8fc0bc2f48ed74e0eba330adb183708f";
const WEATHER_LAT = 6.6194;
const WEATHER_LON = 3.5105;

document.addEventListener("DOMContentLoaded", () => {
  setFooterInformation();

  setEventDates();

  loadWeather();

  loadSpotlights();
});

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

/* =========================================
   EVENTS
   Keeps the "current events" upcoming: the three events
   are placed 7, 14 and 28 days from today.
   ========================================= */

function setEventDates() {
  const offsets = [7, 14, 28];

  document.querySelectorAll(".event-date").forEach((box, index) => {
    const date = new Date();

    date.setDate(date.getDate() + (offsets[index] ?? 7 * (index + 1)));

    const day = String(date.getDate()).padStart(2, "0");

    const month = date
      .toLocaleDateString("en-US", { month: "short" })
      .toUpperCase();

    box.innerHTML = `<span>${day}</span><small>${month}</small>`;
  });
}

/* =========================================
   WEATHER
   ========================================= */

async function loadWeather() {
  const currentWeather = document.querySelector("#current-weather");
  const forecast = document.querySelector("#forecast");

  if (!currentWeather || !forecast) {
    return;
  }

  if (!WEATHER_API_KEY || WEATHER_API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") {
    currentWeather.innerHTML = `
            <p class="error">
                Add your OpenWeatherMap API key to scripts/home.js
                to display live weather.
            </p>
        `;

    forecast.innerHTML = "";

    return;
  }

  const query = `lat=${WEATHER_LAT}&lon=${WEATHER_LON}&units=metric&appid=${WEATHER_API_KEY}`;

  try {
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?${query}`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?${query}`),
    ]);

    if (!currentResponse.ok || !forecastResponse.ok) {
      throw new Error("Weather service returned an error.");
    }

    const [currentData, forecastData] = await Promise.all([
      currentResponse.json(),
      forecastResponse.json(),
    ]);

    displayCurrentWeather(currentData);

    displayThreeDayForecast(forecastData);
  } catch (error) {
    console.error("Weather error:", error);

    currentWeather.innerHTML = `
            <p class="error">
                Weather information is temporarily unavailable.
                Please try again later.
            </p>
        `;

    forecast.innerHTML = "";
  }
}

function displayCurrentWeather(data) {
  const currentWeather = document.querySelector("#current-weather");

  const icon = data.weather?.[0]?.icon;
  const description = data.weather?.[0]?.description ?? "Weather unavailable";
  const temperature = Math.round(data.main?.temp ?? 0);

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
            >`
            : ""
        }

        <div>
            <p class="weather-temperature">${temperature}°C</p>
            <p class="weather-description">${description}</p>
            <p>Ikorodu, Lagos, Nigeria</p>
        </div>
    `;
}

/*
    The forecast arrives in 3-hour steps (UTC). Group the steps by
    date, skip today, and show the next three days using the step
    closest to 12:00.
*/

function displayThreeDayForecast(data) {
  const forecastContainer = document.querySelector("#forecast");

  const todayKey = new Date().toISOString().slice(0, 10);

  const days = new Map();

  data.list.forEach((item) => {
    const dateKey = item.dt_txt.slice(0, 10);

    if (dateKey === todayKey) {
      return;
    }

    days.set(dateKey, [...(days.get(dateKey) ?? []), item]);
  });

  const hourOf = (item) => Number(item.dt_txt.slice(11, 13));

  forecastContainer.innerHTML = [...days.values()]
    .slice(0, 3)
    .map((day, index) => {
      const midday = day.reduce((best, item) =>
        Math.abs(hourOf(item) - 12) < Math.abs(hourOf(best) - 12) ? item : best,
      );

      const dayName = new Date(midday.dt * 1000).toLocaleDateString("en-NG", {
        weekday: "short",
        timeZone: "UTC",
      });

      const description = midday.weather?.[0]?.description ?? "Unavailable";

      return `
                <article class="forecast-day" style="--i:${index}">
                    <h4>${dayName}</h4>
                    <p><strong>${Math.round(midday.main.temp)}°C</strong></p>
                    <p>${description}</p>
                </article>
            `;
    })
    .join("");
}

/* =========================================
   BUSINESS SPOTLIGHTS
   Three random Gold or Silver members, shown with the same
   card design as the directory page.
   ========================================= */

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

    // accepts [ ... ] or { "members": [ ... ] }
    const members = Array.isArray(data) ? data : data.members;

    if (!Array.isArray(members)) {
      throw new Error("Member data is not in the expected format.");
    }

    const eligibleMembers = members.filter((member) =>
      ["Gold", "Silver"].includes(getLevelName(member)),
    );

    const selectedMembers = shuffle([...eligibleMembers]).slice(0, 3);

    if (!selectedMembers.length) {
      throw new Error("No Gold or Silver members were found.");
    }

    spotlights.innerHTML = selectedMembers.map(createSpotlightCard).join("");
  } catch (error) {
    console.error("Spotlight error:", error);

    spotlights.innerHTML = `
            <p class="error">
                Member spotlights are temporarily unavailable.
            </p>
        `;
  }
}

/* Gold / Silver / Member, whether the JSON uses 3, 2, 1 or words */

function getLevelName(member) {
  const level = String(
    member.membershipLevel ?? member.membership ?? member.level ?? "",
  ).toLowerCase();

  if (level === "3" || level === "gold") {
    return "Gold";
  }

  if (level === "2" || level === "silver") {
    return "Silver";
  }

  return "Member";
}

function createSpotlightCard(member, index) {
  const name = member.name ?? member.companyName ?? "Chamber Member";
  const phone = member.phone ?? "Phone unavailable";
  const address = member.address ?? "Address unavailable";
  const website = member.website ?? member.url ?? "#";

  // add "images/" when only a file name was given
  const logoFile = member.image ?? member.logo ?? "favicon.svg";
  const logoSrc = logoFile.includes("/") ? logoFile : `images/${logoFile}`;

  return `
        <article class="member-card" style="--i:${index}">

            <div class="member-heading">
                <h3>${name}</h3>
                <p>${getLevelName(member)} Member</p>
            </div>

            <div class="member-content">

                <img
                    src="${logoSrc}"
                    alt="${name} logo"
                    width="105"
                    height="85"
                    loading="lazy"
                    onerror="this.onerror=null; this.src='images/favicon.svg';"
                >

                <div class="member-details">

                    <p>
                        <strong>PHONE:</strong>
                        <a href="tel:${String(phone).replace(/[^\d+]/g, "")}">${phone}</a>
                    </p>

                    <p>
                        <strong>ADDRESS:</strong>
                        ${address}
                    </p>

                    <p>
                        <a href="${website}" target="_blank" rel="noopener noreferrer">
                            Visit Website
                        </a>
                    </p>

                </div>

            </div>

        </article>
    `;
}

/* Fisher-Yates shuffle */

function shuffle(array) {
  for (let index = array.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));

    [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
  }

  return array;
}
