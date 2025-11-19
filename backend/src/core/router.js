import { handlePokemonRoute } from "../routes/pokemon.routes.js";
import { sendError } from "../utils/response.js";

export async function router(req, res, parsedUrl) {
  const { pathname } = parsedUrl;

  if (req.method === "GET" && pathname === "/api/health") {
    sendError(res, 200, "API Pokémon funcionando correctamente");
    return;
  }

  const handledByPokemon = await handlePokemonRoute(req, res, parsedUrl);
  if (handledByPokemon) {
    return;
  }

  sendError(res, 404, "Ruta no encontrada en la API Pokémon");
}
