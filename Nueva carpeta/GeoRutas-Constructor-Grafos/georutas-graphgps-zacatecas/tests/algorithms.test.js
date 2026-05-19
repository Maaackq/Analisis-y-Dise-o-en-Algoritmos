const test = require('node:test');
const assert = require('node:assert/strict');
const dijkstra = require('../algorithms/dijkstra');
const prim = require('../algorithms/prim');
const kruskal = require('../algorithms/kruskal');

const graph = {
  nodes: [
    { id: 'A', name: 'A', lat: 0, lng: 0 },
    { id: 'B', name: 'B', lat: 0, lng: 1 },
    { id: 'C', name: 'C', lat: 1, lng: 1 },
    { id: 'D', name: 'D', lat: 1, lng: 0 }
  ],
  edges: [
    { id: 'AB', sourceId: 'A', targetId: 'B', distance: 1, time: 1, cost: 1, bidirectional: 1 },
    { id: 'BC', sourceId: 'B', targetId: 'C', distance: 2, time: 2, cost: 2, bidirectional: 1 },
    { id: 'CD', sourceId: 'C', targetId: 'D', distance: 1, time: 1, cost: 1, bidirectional: 1 },
    { id: 'AD', sourceId: 'A', targetId: 'D', distance: 5, time: 5, cost: 5, bidirectional: 1 },
    { id: 'AC', sourceId: 'A', targetId: 'C', distance: 4, time: 4, cost: 4, bidirectional: 1 }
  ]
};

test('Dijkstra calcula la ruta mínima esperada', () => {
  const result = dijkstra(graph, 'A', 'D', 'distance');
  assert.equal(result.applicable, true);
  assert.deepEqual(result.pathNodes, ['A', 'B', 'C', 'D']);
  assert.equal(result.totalCost, 4);
});

test('Prim genera un árbol de expansión mínima', () => {
  const result = prim(graph, 'A', 'distance');
  assert.equal(result.applicable, true);
  assert.equal(result.selectedEdges.length, 3);
  assert.equal(result.totalCost, 4);
});

test('Kruskal genera un árbol de expansión mínima', () => {
  const result = kruskal(graph, 'distance');
  assert.equal(result.applicable, true);
  assert.equal(result.selectedEdges.length, 3);
  assert.equal(result.totalCost, 4);
});
