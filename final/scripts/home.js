import { loadFilms } from "./main.js";
import { setupModal } from "./modal.js";

loadFilms().then(films => setupModal(films)).catch(error => console.error(error));
