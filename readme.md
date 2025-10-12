# API de Chistes (Node + Express, JSON file storage)

API RESTful para gestionar **chistes** con **Node.js** y **Express**.  
Incluye **CORS**, validaciones de entrada y persistencia simple en archivo `dev-data/data.json` (un arreglo de chistes).

---

## 🚀 URL Base

- Producción (Railway): `https://https://badjokesapi-production.up.railway.app/`
- Local: `http://localhost:8000`

---

## ✨ Características

- Lectura de todos los chistes o de uno por `id` (acepta índice numérico o el `id` del objeto).
- Creación de chistes con **UUID v4** y validación (`string`, no vacío, ≤ 300 chars).
- Eliminación por `id` (soporta `id` numérico o **UUID** almacenado).
- **CORS** habilitado para consumo desde frontends.
- Persistencia en archivo **JSON** (filesystem).

---

## 💻 Tecnologías

- Node.js
- Express.js
- uuid (v4)
- CORS

---

## 🔧 Estructura del Proyecto

    .
    ├── dev-data/
    │   └── data.json          # “Base de datos” JSON (arreglo de chistes)
    ├── routes/
    │   └── chistes.js         # Router con endpoints /, /chistes, /chisteNuevo, /chistes/:id
    ├── server.js              # App Express, CORS, middlewares y montaje del router
    ├── package.json
    └── package-lock.json

---

## 🗃️ Modelo de Datos

Cada chiste es un objeto:

    {
      "id": 0 | "uuid-v4",
      "chiste": "Texto del chiste"
    }

- En los datos iniciales, `id` puede ser **numérico** (0, 1, 2, …).  
- Los creados vía API usan **UUID v4** como `id` (cadena).  
- El archivo completo es un **arreglo**: `[ { id, chiste }, ... ]`.

---

## ⚙️ Instalación y Ejecución Local

1) Instalar dependencias

    npm install

2) Crear archivo de datos (si no existe)

    dev-data/data.json

   Contenido mínimo:

    []

3) Script de arranque en `package.json`

    {
      "scripts": {
        "start": "node server.js"
      }
    }

4) Ejecutar

    npm start

- Local: `http://localhost:8000`  
- En Railway: el puerto lo inyecta la plataforma (`process.env.PORT`) y la app escucha en `0.0.0.0`.

---

## 📖 Endpoints

### 1) GET `/`
Devuelve **todo** el arreglo de chistes.

**Ejemplo (cURL)**

    curl -s https://https://badjokesapi-production.up.railway.app/

**200 OK – ejemplo de respuesta**

    [
      { "id": 0, "chiste": "Tu mamá es tan..." },
      { "id": 1, "chiste": "Tu mamá es tan gorda que..." }
    ]

---

### 2) GET `/chistes`
Devuelve todos los chistes o **uno** si pasas `id`.

- Query param (opcional): `id`
  - Si `id` es entero no negativo (p. ej. `"2"`), se interpreta como **índice** del arreglo.
  - Si no es entero válido, se busca por **coincidencia exacta** con el campo `id` (como string), permitiendo **UUID** o números en texto.

**Ejemplos (cURL)**

    # Todos
    curl -s https://https://badjokesapi-production.up.railway.app/chistes

    # Por índice (posición 2 del arreglo)
    curl -s "https://https://badjokesapi-production.up.railway.app/chistes?id=2"

    # Por id exacto (UUID o número)
    curl -s "https://https://badjokesapi-production.up.railway.app/chistes?id=7d6b4a40-6f7b-4c1a-8a7a-a9f6f7a2c3b1"

**404 Not Found – ejemplo**

    { "error": "Chiste no encontrado" }

---

### 3) POST `/chisteNuevo`
Crea un nuevo chiste.

- Body (JSON):
  - `joke` (string, requerido) → validado y `trim()`: no vacío, **≤ 300** caracteres.

**Ejemplo (cURL)**

    curl -X POST "https://https://badjokesapi-production.up.railway.app/chisteNuevo" \
      -H "Content-Type: application/json" \
      -d '{"joke":"Tu mamá es tan..."}'

**201 Created – ejemplo de respuesta**

    {
      "id": "7d6b4a40-6f7b-4c1a-8a7a-a9f6f7a2c3b1",
      "chiste": "Tu mamá es tan..."
    }

**Errores de validación**

    { "error": "joke debe ser string" }
    { "error": "El chiste no puede estar vacio" }
    { "error": "Máximo 300 caracteres" }

**Error de persistencia**

    { "error": "No fue posible guardar el chiste" }

---

### 4) DELETE `/chistes/:id`
Elimina un chiste por **id exacto** (coincide con el campo `id` del objeto).

**Ejemplos (cURL)**

    # Borrar por id numérico (registro inicial)
    curl -X DELETE "https://https://badjokesapi-production.up.railway.app/chistes/0"

    # Borrar por UUID
    curl -X DELETE "https://https://badjokesapi-production.up.railway.app/chistes/7d6b4a40-6f7b-4c1a-8a7a-a9f6f7a2c3b1"

**200 OK – ejemplo de respuesta**

    {
      "deleted": { "id": "7d6b4a40-6f7b-4c1a-8a7a-a9f6f7a2c3b1", "chiste": "Tu mamá es tan..." },
      "chistes": [ ... ]  # arreglo actualizado
    }

**404 Not Found**

    { "error": "Chiste no encontrado" }

**Error de persistencia**

    { "error": "No fue posible eliminar el chiste" }

---

### 5) Rutas no definidas
Cualquier ruta no contemplada responde:

    { "error": "Ruta no encontrada" }

---

## 🧪 Cheatsheet (cURL)

    BASE="https://https://badjokesapi-production.up.railway.app/

    # Listar todos
    curl "$BASE/"

    # Listar todos (endpoint alternativo)
    curl "$BASE/chistes"

    # Obtener por índice
    curl "$BASE/chistes?id=2"

    # Obtener por id (UUID o número)
    curl "$BASE/chistes?id=<ID>"

    # Crear
    curl -X POST "$BASE/chisteNuevo" -H "Content-Type: application/json" \
      -d '{"joke":"Tu mamá es tan..."}'

    # Eliminar por id (numérico o UUID)
    curl -X DELETE "$BASE/chistes/<ID>"

---

## 📝 Notas y Consideraciones

- La **persistencia en archivo** (`dev-data/data.json`) en PaaS puede ser **efímera**; ideal para demos/proyectos personales.
- **CORS** está habilitado globalmente en `server.js` (consumo desde cualquier origen por defecto).
- Mezcla de tipos de `id`:
  - Datos iniciales: `id` numérico.
  - Nuevos: `id` UUID (string).
  - `GET /chistes?id=` maneja ambos (índice o id exacto). `DELETE /chistes/:id` requiere id exacto del objeto.
- Códigos de respuesta usados: `200`, `201`, `400`, `404`, `413`, `500`.

---