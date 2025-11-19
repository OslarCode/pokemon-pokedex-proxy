import https from "node:https";
import { POKEAPI_BASE_URL, EXTERNAL_API_TIMEOUT } from "../config.js";

export function fetchPokemonByNameOrId(nameOrId) {
  const normalized = String(nameOrId).toLowerCase().trim();
  const url = `${POKEAPI_BASE_URL}/pokemon/${normalized}`;

  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let rawData = "";

      res.on("data", (chunk) => {
        rawData += chunk.toString("utf-8");
      });

      res.on("end", () => {
        try {
          const { statusCode } = res;

          if (statusCode >= 200 && statusCode < 300) {
            const json = JSON.parse(rawData);
            resolve(json);
            return;
          }

          if (statusCode === 404) {
            const error = new Error("Pokémon no encontrado en PokeAPI");
            error.statusCode = 404;
            reject(error);
            return;
          }

          const error = new Error(
            `Error al llamar a PokeAPI. Código de estado: ${statusCode}`
          );
          error.statusCode = statusCode;
          reject(error);
        } catch (err) {
          const error = new Error("Error al procesar la respuesta de PokeAPI");
          error.cause = err;
          error.statusCode = 500;
          reject(error);
        }
      });
    });

    req.on("error", (err) => {
      const error = new Error(
        `Error de red al acceder a PokeAPI: ${err.message}`
      );
      error.statusCode = 502;
      reject(error);
    });

    req.setTimeout(EXTERNAL_API_TIMEOUT, () => {
      req.destroy();
      const error = new Error("Timeout al llamar a PokeAPI");
      error.statusCode = 504;
      reject(error);
    });
  });
}

export function fetchPokemonList(limit = 20, offset = 0) {
  const url = `${POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`;

  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let rawData = "";

      res.on("data", (chunk) => {
        rawData += chunk.toString("utf-8");
      });

      res.on("end", () => {
        try {
          const { statusCode } = res;

          if (statusCode >= 200 && statusCode < 300) {
            const json = JSON.parse(rawData);
            resolve(json);
            return;
          }

          const error = new Error(
            `Error al obtener listado de Pokémon. Código de estado: ${statusCode}`
          );
          error.statusCode = statusCode;
          reject(error);
        } catch (err) {
          const error = new Error(
            "Error al procesar la respuesta de listado de PokeAPI"
          );
          error.cause = err;
          error.statusCode = 500;
          reject(error);
        }
      });
    });

    req.on("error", (err) => {
      const error = new Error(
        `Error de red al obtener listado de PokeAPI: ${err.message}`
      );
      error.statusCode = 502;
      reject(error);
    });

    req.setTimeout(EXTERNAL_API_TIMEOUT, () => {
      req.destroy();
      const error = new Error("Timeout al obtener listado de PokeAPI");
      error.statusCode = 504;
      reject(error);
    });
  });
}
