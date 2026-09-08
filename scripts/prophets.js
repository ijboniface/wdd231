const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';
const cards = document.querySelector('#cards');

async function getProphetData() {
  const response = await fetch(url);
  const data = await response.json();
  // console.table(data.prophets); // temporary testing of data response
  displayProphets(data.prophets);
}

const displayProphets = (prophets) => {
  prophets.forEach((prophet) => {
    // Create elements to add to the div#cards element
    let card = document.createElement('section');
    let fullName = document.createElement('h2');
    let dates = document.createElement('p');
    let place = document.createElement('p');
    let portrait = document.createElement('img');

    // Build the h2 content out to show the prophet's full name
    fullName.textContent = `${prophet.name} ${prophet.lastname}`;

    // Build the Date of Birth and Place of Birth paragraphs
    dates.textContent = `Date of Birth: ${prophet.birthdate}`;
    place.textContent = `Place of Birth: ${prophet.birthplace}`;

    // Build the image portrait by setting all the relevant attributes
    portrait.setAttribute('src', prophet.imageurl);
    portrait.setAttribute('alt', `Portrait of ${prophet.name} ${prophet.lastname}`);
    portrait.setAttribute('loading', 'lazy');
    portrait.setAttribute('width', '340');
    portrait.setAttribute('height', '440');
    portrait.setAttribute('referrerpolicy', 'no-referrer');

    // Diagnostic: log to console if an individual image fails to load
    portrait.addEventListener('error', () => {
      console.error(`Image failed to load for ${prophet.name} ${prophet.lastname}: ${prophet.imageurl}`);
    });

    // Append the section(card) with the created elements
    card.appendChild(fullName);
    card.appendChild(dates);
    card.appendChild(place);
    card.appendChild(portrait);

    cards.appendChild(card);
  }); // end of arrow function and forEach loop
};

getProphetData();