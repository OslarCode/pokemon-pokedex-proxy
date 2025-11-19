# PokeAPI Local Proxy (Node.js Puro + ES Modules)

Proyecto educativo que construye un **servidor proxy local** para consumir la PokeAPI de manera controlada y profesional usando **Node.js puro**, sin frameworks.
Incluye un **frontend sencillo** en Bootstrap que consume este backend, mostrando Pokémon con paginación, búsqueda y detalles básicos.

Este proyecto está diseñado para aprender:

- Cómo llamar APIs externas desde Node.js sin librerías externas
- Cómo construir un backend modular realista sin frameworks
- Cómo exponer endpoints propios que actúan como proxy
- Cómo integrar un frontend consumiendo tu propia API local
- Buenas prácticas en arquitectura, modularización y estructura de archivos

## Características principales

- Node.js puro con ES Modules
- Cliente interno de PokeAPI modularizado
- Servidor HTTP sin Express
- Caché simple en memoria opcional
- Paginación implementada en el proxy
- Frontend con Bootstrap + JavaScript moderno
- Estructura real de proyecto backend
- Código limpio, comentado y educativo
- Preparado para extender con filtros, búsqueda avanzada, tipos, etc.

## Requisitos

- Node.js 18 o superior
- Navegador moderno
- Editor recomendado: VSCode

## Instalación

Clona el repositorio:

```bash
git clone https://github.com/OslarCode/pokeapi-proxy.git
cd pokeapi-proxy
```

Instala dependencias (solo dev, si las hubiese):

```bash
npm install
```

## Scripts disponibles

Iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

Iniciar servidor en modo producción:

```bash
npm start
```

## Estructura del proyecto

```
/src
  /server
    server.js
    router.js
  /services
    pokeapi-client.js
  /controllers
    pokemon-controller.js
  /utils
    response.js
    cache.js
/frontend
  index.html
  app.js
```

Esta estructura imita una arquitectura backend real, separando:

- Controladores
- Servicios externos
- Manejadores de respuestas
- Routers
- Frontend separado en su propia carpeta

## Endpoints del Proxy

### Listar Pokémon

```
GET /api/pokemon?page=1&limit=20
```

### Obtener Pokémon por nombre o ID

```
GET /api/pokemon/:id
```

Ejemplo:

```
GET /api/pokemon/pikachu
```

## Frontend incluido

El proyecto incluye:

- index.html con Bootstrap CDN
- app.js con JavaScript moderno
- Tarjetas de Pokémon
- Paginación implementada
- Modo cliente totalmente separado del backend

Si el servidor corre en:

```
http://localhost:3000
```

Solo abre el archivo:

```
frontend/index.html
```

## Cómo funciona el proxy

1. El frontend nunca llama directamente a la PokeAPI externa.
2. En su lugar llama al backend local:

   ```
   http://localhost:3000/api/pokemon
   ```

3. El backend usa `fetch` nativo de Node.js para solicitar datos reales.
4. El backend transforma la respuesta en un formato estable:

   - nombres
   - sprites
   - id
   - paginación real

5. El frontend muestra los resultados.

Ventaja:
Puedes **controlar**, **filtrar**, **cachear** y **expandir** la API sin límites.

## Ejemplo de respuesta

```json
{
  "page": 1,
  "limit": 20,
  "total": 1300,
  "results": [
    {
      "id": 1,
      "name": "bulbasaur",
      "sprite": "https://raw.githubusercontent.com/.../1.png"
    }
  ]
}
```

## Roadmap

- Filtros por tipo
- Búsqueda por nombre con debounce
- Modo “favoritos” usando JSON local
- Caché persistente en archivo
- Detalles del Pokémon con estadísticas
- Integrar imágenes high-resolution
- Sistema de rate limiting opcional

## Licencia

Este proyecto está licenciado bajo:

### **CC BY 4.0 — Creative Commons Attribution 4.0 International**

Puedes usarlo, modificarlo y distribuirlo siempre que incluyas la atribución al autor original.

**Atribución requerida:**
Creado por **OslarCode**
GitHub: [https://github.com/OslarCode/OslarCode](https://github.com/OslarCode/OslarCode)

Licencia completa:
[https://creativecommons.org/licenses/by/4.0/](https://creativecommons.org/licenses/by/4.0/)

## Autor

**OslarCode**
Desarrollador y formador especializado en backend, frontend moderno y metodologías docentes técnicas.
GitHub: [https://github.com/OslarCode/OslarCode](https://github.com/OslarCode/OslarCode)

## Contribuciones

Las contribuciones son bienvenidas.
Antes de abrir un Pull Request, abre un issue para discutir la propuesta.
