import { loadFilms } from "./main.js";
import { setupModal } from "./modal.js";

try {
  const films = await loadFilms();
  setupModal(films);
} catch (error) {
  console.error(error);
}
