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
