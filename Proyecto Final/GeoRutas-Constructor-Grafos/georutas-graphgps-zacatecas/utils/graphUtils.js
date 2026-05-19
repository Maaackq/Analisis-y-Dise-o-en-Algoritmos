function normalizeWeightKey(weightKey = 'distance') {
  const allowed = ['distance', 'time', 'cost'];
  return allowed.includes(weightKey) ? weightKey : 'distance';
}

function edgeWeight(edge, weightKey) {
  const key = normalizeWeightKey(weightKey);
  const value = Number(edge[key]);
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`Peso inválido en la arista ${edge.id}.`);
  }
  return value;
}

function buildAdjacency(nodes, edges, weightKey = 'distance') {
  const adjacency = new Map(nodes.map((node) => [node.id, []]));
  edges.forEach((edge) => {
    const weight = edgeWeight(edge, weightKey);
    if (!adjacency.has(edge.sourceId) || !adjacency.has(edge.targetId)) {
      throw new Error(`La arista ${edge.id} referencia nodos inexistentes.`);
    }
    adjacency.get(edge.sourceId).push({
      edgeId: edge.id,
      from: edge.sourceId,
      to: edge.targetId,
      weight,
      edge
    });
    if (Number(edge.bidirectional) === 1) {
      adjacency.get(edge.targetId).push({
        edgeId: edge.id,
        from: edge.targetId,
        to: edge.sourceId,
        weight,
        edge
      });
    }
  });
  return adjacency;
}

function getEdgeMap(edges) {
  return new Map(edges.map((edge) => [edge.id, edge]));
}

function getNodeMap(nodes) {
  return new Map(nodes.map((node) => [node.id, node]));
}

module.exports = {
  normalizeWeightKey,
  edgeWeight,
  buildAdjacency,
  getEdgeMap,
  getNodeMap
};
