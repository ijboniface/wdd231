# Gospelwood — African Film Directory

Vanilla HTML, CSS and JavaScript implementation for the WDD231 final project.

## Pages
- index.html — landing page
- films.html — searchable/filterable film directory
- industries.html — African Christian film industries and regions
- submit.html — HTML form and action-result page
- attributions.html — source/attribution page

## JavaScript requirements demonstrated
- Fetch API with async error handling
- Dynamic film cards from JSON
- Multiple data properties per item
- ES modules
- DOM manipulation and event listeners
- Array methods: map, filter, flatMap, sort
- localStorage saved-film list
- Accessible dialog modal
- Responsive navigation
- Reduced-motion support

## Before submission
1. Replace the YouTube placeholder URL in all three main pages.
2. Run the WDD231 audit tool.
3. Test at 320px width and on a larger desktop.
4. Check Lighthouse and browser console.
5. Validate HTML/CSS.
6. Publish the `final` folder through GitHub Pages.

## v2 research and interaction update
- Added 23 EVOM World Network titles verified in the research pass; unverified metadata is intentionally blank.
- Added the upcoming *Displaced* entry for Felix Bankole. The public release date was not located, so it is marked Upcoming rather than assigned a guessed date.
- Added original lightweight SVG directory-cover artwork for all catalogue entries.
- Added click ripples, press feedback, hover lift, poster zoom, modal entrance, and filtered-card reveal animations.
- Added reduced-motion handling.

## Source update
The Industries & Regions page now distinguishes source-backed claims and names the principal source for each regional entry. The attribution page has also been expanded with official and high-authority research sources, including Mount Zion, Kenya Film Commission, John 316 Film School Foundation, Ghana News Agency, NTA, ICVM and Christian Filmmakers Network.

## Homepage timeline update
The homepage timeline is now cross-continental and multi-production: it includes Mount Zion, EVOM, Kenya and the upcoming Felix Bankole project instead of presenting Mount Zion's history as the history of African Christian cinema.


### Film submissions
The submission form uses `form-action.html` as the required action page and stores test submissions in browser `localStorage` so they can be reviewed through the local submission inbox. GitHub Pages is static, so this is not a shared server-side database. For real public submissions, connect the form to a service such as Formspree or a custom backend/database.


## Film-source policy
Each directory record now includes a verified `source` URL. Mount Zion titles point to Mount Zion Film Productions; Felix Bankole titles point to the relevant official Felix Bankole TV film pages; EVOM titles point to the official EVOM Channel when an exact stable film URL was not established in this research pass.

### Source-link verification
The film-directory source links were reviewed against current web sources. Links are intended to point to a film-specific official film page/video or a source that explicitly documents the film. Where a dedicated film page could not be reliably established, the link points to a reputable article/archive that documents the title rather than to an unrelated or fabricated URL.


## Adding original film posters

Put downloaded film artwork in `images/posters/`. Keep the original aspect ratio. Then set the matching film's `posterUrl` in `data/films.json` to a relative path such as `images/posters/the-missing-link.jpg`. The card uses `object-fit: contain`, so the complete poster remains visible instead of being cropped.

The homepage promotes the upcoming *Displaced* project in a single dedicated feature. Film cards are shown in the Films directory rather than repeated in the homepage spotlight.


## Filmmaker spotlight and channel-sourced films

The home page rotates through the named filmmakers and production contributors credited in the catalogue. Filmography titles and production credits are retained in the data collection, but the spotlight does not repeat film cards already available on the Films page. The Films page presents one searchable catalogue with filters for country, year, genre, availability and saved records. Search includes titles, filmmakers, productions and channel names.


### Damilola Mike-Bamiloye catalogue records
The Damilola section includes titles listed on the Mount Zion Movies filmmaker profile. A listing is not treated as proof of a direct YouTube video URL, release year, runtime, or original poster. Where original artwork was not verified, the card uses a clearly labelled Gospelwood catalogue cover. The official channel link is provided for visitors to find available uploads.


## Responsive and directory updates
- Added a filmmaker spotlight record for each named director and production contributor in the current film dataset. Where a verified biography was unavailable, the profile states that limitation instead of inventing a history.
- Removed duplicate channel-film card collections and the homepage featured-film carousel.
- Kept one dedicated upcoming-film promotion for *Displaced*.
- Restored visible Search and Clear controls and expanded search matching to include production and channel names.
- Refined the layout for desktop, tablet and narrow mobile widths, with reduced-motion support and larger touch targets.
