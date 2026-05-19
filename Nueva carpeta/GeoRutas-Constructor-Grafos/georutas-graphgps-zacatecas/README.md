# GeoRutas

## Proyecto Final

```
Luis Miguel García Varela
Brayan Alexis Bermudez Morales
```

## Plataforma Visual de Generación de Grafos con Dijkstra, Prim y Kruskal

Aplicación web para crear grafos, conectar nodos mediante aristas ponderadas y ejecutar visualmente los algoritmos **Dijkstra**, **Prim** y **Kruskal**.

El mapa se conserva solo como área de visualización, pero el objetivo principal de esta versión es la **generación manual o por JSON de grafos** y la ejecución visual de los algoritmos vistos en clase.

## Funcionalidades principales

- Constructor visual de grafos desde la interfaz.
- Creación de nuevos nodos con ID y nombre.
- Creación de aristas entre nodos con peso.
- Generación automática del grafo en pantalla.
- Importación de grafos desde archivo JSON.
- Exportación del grafo construido como JSON.
- Ejecución de Dijkstra para ruta mínima entre origen y destino.
- Ejecución de Prim para árbol de expansión mínima.
- Ejecución de Kruskal para árbol de expansión mínima.
- Visualización de pesos, nodos, aristas y resultados.
- Panel con costo total, nodos visitados y tiempo de ejecución.
- Historial de ejecuciones con SQLite.

## Stack

- Node.js
- Express.js
- SQLite con `better-sqlite3`
- HTML5
- CSS3
- JavaScript vanilla modular
- Leaflet para visualización gráfica

## Instalación local

Desde la carpeta donde está `package.json`:

```bash
npm install
npm run dev
```

Abrir en el navegador:

```text
http://localhost:3000
```

Si se necesita reiniciar la base de datos con los datos de ejemplo:

```bash
npm run init-db
```

## Cómo crear un grafo desde la interfaz

1. En el panel izquierdo, ubicar la sección **Constructor de grafo**.
2. Escribir el ID del nodo, por ejemplo `A`.
3. Escribir el nombre, por ejemplo `Nodo A`.
4. Presionar **Agregar nodo**.
5. Repetir para crear más nodos.
6. En la parte de aristas, seleccionar nodo origen, nodo destino y peso.
7. Presionar **Agregar arista**.
8. Cuando el grafo esté completo, presionar **Generar grafo**.
9. Seleccionar algoritmo: Dijkstra, Prim o Kruskal.
10. Presionar **Calcular y trazar**.

## Formato JSON aceptado

Se acepta el formato completo:

```json
{
  "nodes": [
    { "id": "A", "name": "Nodo A", "lat": 22.77, "lng": -102.58 },
    { "id": "B", "name": "Nodo B", "lat": 22.76, "lng": -102.56 }
  ],
  "edges": [
    { "id": "AB", "sourceId": "A", "targetId": "B", "distance": 5, "time": 5, "cost": 5, "bidirectional": 1 }
  ]
}
```

También se acepta un formato simplificado:

```json
{
  "nodes": [
    { "id": "A", "name": "Nodo A" },
    { "id": "B", "name": "Nodo B" },
    { "id": "C", "name": "Nodo C" }
  ],
  "edges": [
    { "source": "A", "target": "B", "weight": 4 },
    { "source": "B", "target": "C", "weight": 2 },
    { "source": "A", "target": "C", "weight": 7 }
  ]
}
```

Cuando el JSON no incluye coordenadas, el sistema acomoda automáticamente los nodos para poder visualizarlos.

## Algoritmos

### Dijkstra

Calcula la ruta de menor costo entre un nodo origen y un nodo destino dentro de un grafo ponderado con pesos no negativos.

### Prim

Construye un árbol de expansión mínima conectando todos los nodos alcanzables con el menor costo posible, partiendo de un nodo inicial.

### Kruskal

Construye un árbol de expansión mínima seleccionando aristas de menor peso y evitando ciclos.

## Estructura del proyecto

```text
georutas-graphgps-zacatecas/
├── app.js
├── package.json
├── algorithms/
│   ├── dijkstra.js
│   ├── prim.js
│   └── kruskal.js
├── public/
│   ├── index.html
│   ├── css/styles.css
│   └── js/
│       ├── app.js
│       ├── builder.js
│       ├── map.js
│       ├── ui.js
│       ├── api.js
│       └── state.js
├── services/
├── models/
├── routes/
├── controllers/
├── database/
├── examples/
└── tests/
```

## Pruebas

```bash
npm test
```

## Cierre del servidor local

En la terminal donde está corriendo el proyecto:

```text
Ctrl + C
```

Si pregunta `Terminate batch job (Y/N)?  ó 
¿Desea terminar el trabajo por lotes (S/N)?`, escribir:

```text
Y
/
S
```
