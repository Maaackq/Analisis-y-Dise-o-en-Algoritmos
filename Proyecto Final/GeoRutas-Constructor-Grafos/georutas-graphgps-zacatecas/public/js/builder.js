import { api } from './api.js';
import { state } from './state.js';
import { fitToGraph, renderGraph, drawResult } from './map.js';
import { renderControls, renderResultSummary, showToast } from './ui.js';

const builderRefs = {};
const draft = {
  nodes: [],
  edges: []
};

const ids = [
  'builderNodeId',
  'builderNodeName',
  'btnAddNode',
  'builderEdgeSource',
  'builderEdgeTarget',
  'builderEdgeWeight',
  'btnAddEdge',
  'draftNodeCount',
  'draftEdgeCount',
  'draftGraphList',
  'btnGenerateGraph',
  'btnClearDraft',
  'btnExportDraft'
];

function getRef(id) {
  return builderRefs[id];
}

function normalizeId(value) {
  return String(value || '').trim().replace(/\s+/g, '_');
}

function getNextNodeId() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (const char of alphabet) {
    if (!draft.nodes.some((node) => node.id === char)) return char;
  }
  return `N${draft.nodes.length + 1}`;
}

function autoPositionNodes(nodes) {
  const center = { lat: 22.7709, lng: -102.5833 };
  const radiusLat = 0.026;
  const radiusLng = 0.040;
  const total = Math.max(nodes.length, 1);

  return nodes.map((node, index) => {
    const angle = (2 * Math.PI * index) / total - Math.PI / 2;
    return {
      ...node,
      lat: Number.isFinite(Number(node.lat)) ? Number(node.lat) : center.lat + radiusLat * Math.sin(angle),
      lng: Number.isFinite(Number(node.lng)) ? Number(node.lng) : center.lng + radiusLng * Math.cos(angle),
      type: node.type || 'waypoint',
      description: node.description || 'Nodo creado desde el constructor visual'
    };
  });
}

function edgeOptions() {
  if (!draft.nodes.length) return '<option value="">Sin nodos</option>';
  return draft.nodes.map((node) => `<option value="${node.id}">${node.id} - ${node.name}</option>`).join('');
}

function renderDraft() {
  getRef('draftNodeCount').textContent = draft.nodes.length;
  getRef('draftEdgeCount').textContent = draft.edges.length;
  getRef('builderEdgeSource').innerHTML = edgeOptions();
  getRef('builderEdgeTarget').innerHTML = edgeOptions();
  getRef('builderNodeId').placeholder = getNextNodeId();

  if (!draft.nodes.length && !draft.edges.length) {
    getRef('draftGraphList').innerHTML = '<p class="muted">Aún no has agregado nodos ni aristas.</p>';
    return;
  }

  const nodeItems = draft.nodes.map((node) => `<li><strong>${node.id}</strong> · ${node.name}</li>`).join('');
  const edgeItems = draft.edges.map((edge) => `<li><strong>${edge.sourceId} ↔ ${edge.targetId}</strong> · peso ${edge.distance}</li>`).join('');

  getRef('draftGraphList').innerHTML = `
    <div>
      <strong>Nodos</strong>
      <ul>${nodeItems || '<li class="muted">Sin nodos</li>'}</ul>
    </div>
    <div>
      <strong>Aristas</strong>
      <ul>${edgeItems || '<li class="muted">Sin aristas</li>'}</ul>
    </div>
  `;
}

function addNode() {
  const id = normalizeId(getRef('builderNodeId').value || getNextNodeId()).toUpperCase();
  const name = String(getRef('builderNodeName').value || `Nodo ${id}`).trim();

  if (!id) {
    showToast('Escribe el ID del nodo. Ejemplo: A');
    return;
  }

  if (draft.nodes.some((node) => node.id === id)) {
    showToast(`El nodo ${id} ya existe.`);
    return;
  }

  draft.nodes.push({ id, name });
  getRef('builderNodeId').value = '';
  getRef('builderNodeName').value = '';
  renderDraft();
  showToast(`Nodo ${id} agregado.`);
}

function addEdge() {
  const sourceId = getRef('builderEdgeSource').value;
  const targetId = getRef('builderEdgeTarget').value;
  const weight = Number(getRef('builderEdgeWeight').value);

  if (!sourceId || !targetId) {
    showToast('Selecciona origen y destino de la arista.');
    return;
  }

  if (sourceId === targetId) {
    showToast('Una arista debe conectar dos nodos diferentes.');
    return;
  }

  if (!Number.isFinite(weight) || weight < 0) {
    showToast('El peso debe ser un número válido mayor o igual a 0.');
    return;
  }

  const exists = draft.edges.some((edge) =>
    (edge.sourceId === sourceId && edge.targetId === targetId) ||
    (edge.sourceId === targetId && edge.targetId === sourceId)
  );

  if (exists) {
    showToast('Esa conexión ya existe.');
    return;
  }

  const edgeNumber = draft.edges.length + 1;
  draft.edges.push({
    id: `E${edgeNumber}_${sourceId}_${targetId}`,
    sourceId,
    targetId,
    distance: weight,
    time: weight,
    cost: weight,
    bidirectional: 1,
    label: `${sourceId}-${targetId}`
  });

  getRef('builderEdgeWeight').value = '';
  renderDraft();
  showToast(`Arista ${sourceId} ↔ ${targetId} agregada.`);
}

function graphPayload() {
  return {
    nodes: autoPositionNodes(draft.nodes),
    edges: draft.edges.map((edge, index) => ({
      ...edge,
      id: edge.id || `E${index + 1}`,
      distance: Number(edge.distance),
      time: Number(edge.time ?? edge.distance),
      cost: Number(edge.cost ?? edge.distance),
      bidirectional: Number(edge.bidirectional ?? 1)
    }))
  };
}

async function generateGraph() {
  if (draft.nodes.length < 2) {
    showToast('Agrega al menos dos nodos.');
    return;
  }
  if (draft.edges.length < 1) {
    showToast('Agrega al menos una arista.');
    return;
  }

  try {
    const imported = await api.importGraph(graphPayload());
    state.graph = imported;
    state.originId = null;
    state.destinationId = null;
    state.result = null;
    state.routeCoordinates = [];
    renderControls();
    renderGraph();
    drawResult();
    renderResultSummary();
    fitToGraph();
    showToast('Grafo generado correctamente desde el constructor.');
  } catch (error) {
    showToast(error.message);
  }
}

function clearDraft() {
  draft.nodes = [];
  draft.edges = [];
  renderDraft();
  showToast('Constructor limpiado.');
}

function downloadJson() {
  if (draft.nodes.length < 2 || draft.edges.length < 1) {
    showToast('Agrega al menos dos nodos y una arista antes de exportar.');
    return;
  }

  const blob = new Blob([JSON.stringify(graphPayload(), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `grafo-georutas-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast('JSON del grafo descargado.');
}

function seedFromCurrentGraph() {
  if (!state.graph?.nodes?.length) return;
  draft.nodes = state.graph.nodes.map(({ id, name, lat, lng, type, description }) => ({ id, name, lat, lng, type, description }));
  draft.edges = state.graph.edges.map((edge) => ({ ...edge }));
  renderDraft();
}

export function initializeGraphBuilder() {
  ids.forEach((id) => {
    builderRefs[id] = document.getElementById(id);
  });

  if (!getRef('btnAddNode')) return;

  getRef('btnAddNode').addEventListener('click', addNode);
  getRef('btnAddEdge').addEventListener('click', addEdge);
  getRef('btnGenerateGraph').addEventListener('click', generateGraph);
  getRef('btnClearDraft').addEventListener('click', clearDraft);
  getRef('btnExportDraft').addEventListener('click', downloadJson);

  getRef('builderNodeId').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') addNode();
  });
  getRef('builderNodeName').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') addNode();
  });
  getRef('builderEdgeWeight').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') addEdge();
  });

  renderDraft();

  window.GeoRutasBuilder = {
    seedFromCurrentGraph,
    draft
  };
}
