import http from "node:http";
import { URL } from "node:url";
import { router } from "./router.js";
import { handleCorsPreflight } from "../utils/response.js";
import { PORT } from "../config.js";

export function createHttpServer() {
  const server = http.createServer(async (req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === "OPTIONS") {
      handleCorsPreflight(res);
      return;
    }

    try {
      await router(req, res, parsedUrl);
    } catch (error) {
      console.error("Error no controlado en el servidor:", error);
      res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
      res.end(
        JSON.stringify({ error: { message: "Error interno del servidor" } })
      );
    }
  });

  return server;
}

export function startServer() {
  const server = createHttpServer();

  server.listen(PORT, () => {
    console.log(`Servidor API Pokémon escuchando en http://localhost:${PORT}`);
    console.log(`Ejemplo: http://localhost:${PORT}/api/pokemon/pikachu`);
  });

  process.on("SIGTERM", () => {
    console.log("Apagando servidor...");
    server.close(() => {
      console.log("Servidor apagado correctamente");
      process.exit(0);
    });
  });
}
