import {
  fetchPokemonByNameOrId,
  fetchPokemonList,
} from "../services/pokeapi-client.js";
import { sendJson, sendError } from "../utils/response.js";

export async function handlePokemonRoute(req, res, parsedUrl) {
  const { pathname, searchParams } = parsedUrl;

  if (req.method !== "GET") {
    return false;
  }

  if (pathname === "/api/pokemon") {
    await handlePokemonList(req, res, searchParams);
    return true;
  }

  if (pathname.startsWith("/api/pokemon/")) {
    await handlePokemonDetail(req, res, pathname);
    return true;
  }

  return false;
}

async function handlePokemonList(req, res, searchParams) {
  const limitParam = searchParams.get("limit") ?? "20";
  const pageParam = searchParams.get("page") ?? "1";

  let limit = parseInt(limitParam, 10);
  let page = parseInt(pageParam, 10);

  if (Number.isNaN(limit) || limit <= 0 || limit > 100) {
    limit = 20;
  }

  if (Number.isNaN(page) || page <= 0) {
    page = 1;
  }

  const offset = (page - 1) * limit;

  try {
    const data = await fetchPokemonList(limit, offset);

    const mappedResults = data.results.map((item, index) => {
      const urlParts = item.url.split("/").filter(Boolean);
      const idFromUrl = parseInt(urlParts[urlParts.length - 1], 10);

      return {
        name: item.name,
        id: Number.isNaN(idFromUrl) ? offset + index + 1 : idFromUrl,
      };
    });

    const payload = {
      page,
      limit,
      total: data.count,
      hasNextPage: Boolean(data.next),
      hasPrevPage: Boolean(data.previous),
      results: mappedResults,
    };

    sendJson(res, 200, payload);
  } catch (error) {
    console.error("Error en handlePokemonList:", error);
    const statusCode = error.statusCode || 500;
    sendError(
      res,
      statusCode,
      "Error al obtener el listado de Pokémon. Inténtalo más tarde."
    );
  }
}

async function handlePokemonDetail(req, res, pathname) {
  const parts = pathname.split("/");
  const nameOrId = parts[3];

  if (!nameOrId) {
    sendError(
      res,
      400,
      "Debes indicar el nombre o ID del Pokémon, por ejemplo /api/pokemon/pikachu"
    );
    return;
  }

  try {
    const pokemonData = await fetchPokemonByNameOrId(nameOrId);
    sendJson(res, 200, pokemonData);
  } catch (error) {
    console.error("Error en handlePokemonDetail:", error.message);
    const statusCode = error.statusCode || 500;
    const message =
      statusCode === 404
        ? "Pokémon no encontrado. Verifica el nombre o ID."
        : "Error al obtener los datos del Pokémon. Inténtalo más tarde.";

    sendError(res, statusCode, message);
  }
}
