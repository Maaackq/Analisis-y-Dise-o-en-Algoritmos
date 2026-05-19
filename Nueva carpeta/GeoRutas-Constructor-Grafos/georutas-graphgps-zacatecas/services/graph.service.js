const graphModel = require('../models/graph.model');
const AppError = require('../utils/AppError');

function autoPositionNodes(nodes) {
  const center = { lat: 22.7709, lng: -102.5833 };
  const radiusLat = 0.026;
  const radiusLng = 0.040;
  const total = Math.max(nodes.length, 1);

  return nodes.map((node, index) => {
    const angle = (2 * Math.PI * index) / total - Math.PI / 2;
    const lat = Number(node.lat);
    const lng = Number(node.lng);
    return {
      ...node,
      lat: Number.isFinite(lat) ? lat : center.lat + radiusLat * Math.sin(angle),
      lng: Number.isFinite(lng) ? lng : center.lng + radiusLng * Math.cos(angle)
    };
  });
}

function normalizeGraphPayload(payload = {}) {
  const rawNodes = Array.isArray(payload.nodes) ? payload.nodes : [];
  const rawEdges = Array.isArray(payload.edges) ? payload.edges : [];

  const nodes = autoPositionNodes(rawNodes.map((node, index) => ({
    id: String(node.id || node.name || `N${index + 1}`).trim(),
    name: String(node.name || node.id || `Nodo ${index + 1}`).trim(),
    lat: node.lat,
    lng: node.lng,
    type: String(node.type || 'waypoint'),
    description: String(node.description || 'Nodo importado o creado por el usuario')
  })));

  const edges = rawEdges.map((edge, index) => {
    const sourceId = edge.sourceId ?? edge.source ?? edge.from;
    const targetId = edge.targetId ?? edge.target ?? edge.to;
    const weight = edge.weight ?? edge.distance ?? edge.time ?? edge.cost;
    const distance = Number(edge.distance ?? weight);
    const time = Number(edge.time ?? distance);
    const cost = Number(edge.cost ?? distance);

    return {
      id: String(edge.id || `E${index + 1}`).trim(),
      sourceId: String(sourceId || '').trim(),
      targetId: String(targetId || '').trim(),
      distance,
      time,
      cost,
      bidirectional: Number(edge.bidirectional ?? 1),
      label: String(edge.label || '')
    };
  });

  return { nodes, edges };
}

function validateGraphPayload(nodes, edges) {
  if (!Array.isArray(nodes) || nodes.length < 2) {
    throw new AppError('El grafo debe incluir al menos dos nodos.', 422);
  }

  if (!Array.isArray(edges) || edges.length < 1) {
    throw new AppError('El grafo debe incluir al menos una arista.', 422);
  }

  const ids = new Set();
  nodes.forEach((node) => {
    if (!node.id || !node.name) {
      throw new AppError('Cada nodo debe incluir id y name.', 422, { node });
    }
    if (ids.has(String(node.id))) {
      throw new AppError(`Nodo duplicado: ${node.id}.`, 422);
    }
    ids.add(String(node.id));
    if (!Number.isFinite(Number(node.lat)) || !Number.isFinite(Number(node.lng))) {
      throw new AppError(`Coordenadas inválidas en el nodo ${node.id}.`, 422);
    }
  });

  const edgeIds = new Set();
  edges.forEach((edge) => {
    if (!edge.id || !edge.sourceId || !edge.targetId) {
      throw new AppError('Cada arista debe incluir id, sourceId y targetId.', 422, { edge });
    }
    if (edgeIds.has(String(edge.id))) {
      throw new AppError(`Arista duplicada: ${edge.id}.`, 422);
    }
    edgeIds.add(String(edge.id));
    if (!ids.has(String(edge.sourceId)) || !ids.has(String(edge.targetId))) {
      throw new AppError(`La arista ${edge.id} referencia nodos no registrados.`, 422);
    }
    if (String(edge.sourceId) === String(edge.targetId)) {
      throw new AppError(`La arista ${edge.id} debe conectar dos nodos diferentes.`, 422);
    }
    ['distance', 'time', 'cost'].forEach((key) => {
      const value = Number(edge[key]);
      if (!Number.isFinite(value) || value < 0) {
        throw new AppError(`Peso ${key} inválido en la arista ${edge.id}.`, 422);
      }
    });
  });
}

function getGraph() {
  return graphModel.getGraph();
}

function importGraph(payload) {
  const graph = normalizeGraphPayload(payload);
  validateGraphPayload(graph.nodes, graph.edges);
  return graphModel.replaceGraph(graph.nodes, graph.edges);
}

module.exports = { getGraph, importGraph, normalizeGraphPayload };
