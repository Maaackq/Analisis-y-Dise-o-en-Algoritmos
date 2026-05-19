# Notas técnicas

## Enfoque de esta versión

La versión actual elimina la simulación GPS y concentra la aplicación en tres aspectos: renderizado estable del mapa, trazado claro del grafo y ejecución verificable de Dijkstra, Prim y Kruskal.

## Mapa

El mapa se centra en Zacatecas, México, con `maxBounds`, `minZoom` y `maxZoom` definidos para evitar que Leaflet solicite tiles del mundo completo. Esto reduce la carga visual inicial y mejora el tiempo de respuesta. Se usa un mapa base ligero de CartoDB/OpenStreetMap y un tile SVG de respaldo para evitar cuadros vacíos cuando el proveedor externo no responde.

## Capas

La interfaz usa panes explícitos de Leaflet:

- `graphPane`: aristas base del grafo.
- `resultPane`: rutas de Dijkstra y árboles mínimos de Prim/Kruskal.
- `weightPane`: etiquetas de pesos.
- `nodePane`: nodos seleccionables y badges de ruta.

El resultado algorítmico se dibuja después del grafo y se fuerza al frente con `bringToFront()` para evitar que quede oculto por las aristas base.

## Algoritmos

- Dijkstra requiere origen y destino. Devuelve ruta, aristas seleccionadas, costo total, nodos visitados y tiempo de ejecución.
- Prim usa el origen como nodo inicial si existe; si no, toma el primer nodo del grafo.
- Kruskal no requiere origen ni destino; genera árbol mínimo o bosque mínimo según la conectividad del grafo.

## Datos iniciales

El dataset inicial representa nodos urbanos de Zacatecas/Guadalupe. Las aristas son una red didáctica controlada, no una red vial certificada. Las líneas se trazan como segmentos rectos entre nodos.
