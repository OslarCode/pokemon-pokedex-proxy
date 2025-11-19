# PokeDex Developer Docs

Documentación interna del proyecto · PokeAPI Proxy

## Introducción

Este documento explica el funcionamiento interno del proyecto **PokeAPI Proxy**, un proxy educativo desarrollado en **Node.js puro con ES Modules**, cuyo objetivo es proporcionar una capa de abstracción, caching, paginación y normalización sobre la API pública oficial de PokéAPI.

Esta documentación está destinada a:

- Desarrolladores que mantengan el backend.
- Estudiantes que quieran comprender cómo se estructura un servidor modular en Node.js sin frameworks.
- Docentes que quieran reutilizar el proyecto como ejercicio real de cliente–servidor.

---

# Arquitectura General

El proyecto sigue una estructura modular inspirada en backend profesional:

```
/src
│── server.js
│── config/
│   └── environment.js
│── core/
│   ├── http-server.js
│   ├── static-handler.js
│   └── response-handler.js
│── modules/
│   ├── pokeapi-client.js
│   ├── pokedex-service.js
│   └── pagination.js
│── utils/
│   ├── logger.js
│   ├── cache.js
│   └── helpers.js
/public
│── index.html
│── css/
│── js/
```

### Principios de diseño utilizados

1. Separación clara entre **capa HTTP**, **capa de negocio** y **capa de datos**.
2. Servidor escrito únicamente con **módulos nativos** de Node.
3. Cliente API encapsulado en módulo propio.
4. Paginación reutilizable e independiente.
5. Sistema de caché en memoria opcional.
6. Frontend separado, usando **Bootstrap 5** y JavaScript ES6.

---

# Módulo: Cliente PokeAPI (`pokeapi-client.js`)

El módulo cliente es el responsable de comunicarse con la PokeAPI oficial.

### Responsabilidades

- Construcción de URLs para PokeAPI.
- Fetch nativo con tratamiento de errores.
- Normalización mínima de datos.
- Capa de abstracción: el backend nunca llama a la API externa directamente.

### Funciones expuestas

```js
getPokemons((page = 1), (limit = 20));
getPokemonByNameOrId(identifier);
getPokemonSpecies(identifier);
```

### Ejemplo interno

```js
const url = `${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`;
const response = await fetch(url);
```

---

# Módulo: Servicio de Pokedex (`pokedex-service.js`)

Se encarga de la **lógica de negocio**.

### Funciones principales

- Unificar datos de Pokémon (stats, sprites, tipos).
- Transformar los datos en un formato apto para frontend.
- Combinar múltiples endpoints de la API original.
- Aplicar estrategias de caché si están habilitadas.

### Ejemplo de normalización

```js
return {
  id: data.id,
  name: data.name,
  height: data.height,
  weight: data.weight,
  sprites: data.sprites,
  types: data.types.map((t) => t.type.name),
};
```

---

# Módulo: Paginación (`pagination.js`)

Define el sistema de paginación usado internamente.

### Métodos documentados

```js
paginate(collection, page, limit);
getMetadata(total, page, limit);
```

Este módulo es independiente del contenido y puede usarse para cualquier colección.

---

# Módulo: Caché (`cache.js`)

Sistema de caché en memoria, diseñado para acelerar peticiones repetidas.

### API del servicio

```js
cache.set(key, value, ttlSeconds);
cache.get(key);
cache.has(key);
```

### Comportamiento

- Los items expiran automáticamente.
- El TTL puede configurarse desde environment.js.
- El servidor nunca se rompe por un fallo del sistema de caché.

---

# Capa HTTP (`http-server.js`)

Es el servidor HTTP puro.

### Funciones internas

- Gestión de rutas manual.
- Envío de encabezados estándar.
- Detección de archivos estáticos.
- Gestión de errores controlados.

### Ejemplo de respuesta

```js
responseHandler.json(res, 200, { data, pagination });
```

---

# Rutas del servidor

## 1. GET /api/pokemon

Obtiene una lista de Pokémon paginados.

### Parámetros

| Query   | Descripción                           |
| ------- | ------------------------------------- |
| `page`  | Número de página (por defecto 1)      |
| `limit` | Registros por página (por defecto 20) |

### Ejemplo

```
GET http://localhost:3000/api/pokemon?page=2&limit=10
```

### Respuesta

```json
{
  "data": [...],
  "pagination": {
    "total": 1302,
    "page": 2,
    "limit": 10
  }
}
```

---

## 2. GET /api/pokemon/:idOrName

Obtiene la ficha completa de un Pokémon específico.

### Ejemplos

```
GET /api/pokemon/pikachu
GET /api/pokemon/25
```

### Respuesta

```json
{
  "id": 25,
  "name": "pikachu",
  "height": 4,
  "weight": 60,
  "sprites": {...},
  "types": ["electric"]
}
```

---

# Frontend interno (`/public`)

La carpeta contiene la interfaz PokeDex.

### Tecnologías utilizadas

- Bootstrap 5 (CDN)
- Fetch API
- Módulos ES6
- Componentes organizados

### Vistas principales

1. **PokedexListPage**
   Página principal con tarjetas e imágenes.

2. **PokemonDetailPage**
   Muestra ficha individual.

3. **Servicios de frontend**
   `api-client.js` para peticiones.
   `ui-render.js` para componentes visuales.
   `pagination-ui.js` para navegación entre páginas.

---

# Flujo Completo de Petición

1. Usuario hace clic en “Ver más Pokémon”.
2. Frontend → fetch a `/api/pokemon?page=2`.
3. Servidor recibe petición, consulta caché.
4. Si no existe, llama a PokeAPI externa via `pokeapi-client.js`.
5. `pokedex-service.js` normaliza datos.
6. `response-handler.js` empaqueta y envía respuesta.
7. Frontend renderiza tarjetas al instante.

---

# Errores esperados / Sistema de fallos

El backend define respuestas claras:

| Código | Caso                  |
| ------ | --------------------- |
| 200    | Respuesta exitosa     |
| 400    | Parámetros inválidos  |
| 404    | Pokémon no encontrado |
| 500    | Error interno         |

---

# To-Do técnico (roadmap interno)

- Añadir sistema de logs persistentes.
- Mejorar el diseño de frontend con vista comparativa.
- Añadir opción de favoritos usando almacenamiento local JSON.
- Implementar Rate Limiting.
- Añadir tests unitarios para módulos clave.

---

# Créditos

Proyecto educativo desarrollado por **OslarCode**
GitHub: [https://github.com/OslarCode/OslarCode](https://github.com/OslarCode/OslarCode)

Licencia: **Creative Commons Attribution 4.0 (CC BY 4.0)**
Requiere atribución al creador original al reutilizar el proyecto.
