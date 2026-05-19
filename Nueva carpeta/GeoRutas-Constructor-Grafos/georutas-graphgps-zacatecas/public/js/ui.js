import { api } from './api.js';
import { state, nodeById, resetSelection } from './state.js';
import { fitToGraph, renderGraph, drawResult } from './map.js';

const refs = {};
let toastTimeout = null;

const explanations = {
  dijkstra: 'Dijkstra calcula la ruta de menor costo entre un origen y un destino usando pesos no negativos. El resultado se traza en azul sobre el grafo.',
  prim: 'Prim construye un árbol de expansión mínima desde un nodo inicial. No devuelve una ruta punto a punto; conecta la red con costo mínimo.',
  kruskal: 'Kruskal ordena aristas por peso y construye un árbol o bosque mínimo evitando ciclos. No requiere destino.'
};

function formatCost(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
  const unit = state.weightKey === 'distance' ? 'km' : state.weightKey === 'time' ? 'min' : 'pts';
  return `${Number(value).toFixed(2)} ${unit}`;
}

function algorithmLabel(value) {
  return ({ dijkstra: 'Dijkstra', prim: 'Prim', kruskal: 'Kruskal' })[value] || value;
}

function nodeLabel(id) {
  if (!id) return '—';
  return nodeById(id)?.name || id;
}

const refIds = [
  'metricNodes',
  'metricEdges',
  'originSelect',
  'destinationSelect',
  'btnClearSelection',
  'weightSelect',
  'toggleWeights',
  'toggleGraph',
  'btnRunAlgorithm',
  'currentInstruction',
  'algorithmStatus',
  'resultTitle',
  'resultMessage',
  'statCost',
  'statVisited',
  'statTime',
  'floatingResult',
  'algorithmExplanation',
  'historyList',
  'toast',
  'btnFitMap',
  'btnOpenControl',
  'btnCloseControl',
  'controlPanel',
  'resultsPanel',
  'btnRefreshHistory',
  'btnDownloadResult',
  'graphFile'
];

export function bindDom() {
  refIds.forEach((id) => {
    refs[id] = document.getElementById(id);
  });

  document.querySelectorAll('[data-algorithm]').forEach((button) => {
    button.addEventListener('click', () => {
      state.algorithm = button.dataset.algorithm;
      state.result = null;
      state.routeCoordinates = [];
      document.querySelectorAll('[data-algorithm]').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      renderControls();
      renderResultSummary();
      drawResult();
      renderGraph();
    });
  });

  refs.originSelect.addEventListener('change', (event) => {
    state.originId = event.target.value || null;
    if (state.originId === state.destinationId) state.destinationId = null;
    state.result = null;
    state.routeCoordinates = [];
    renderControls();
    renderGraph();
    drawResult();
    renderResultSummary();
  });

  refs.destinationSelect.addEventListener('change', (event) => {
    state.destinationId = event.target.value || null;
    if (state.originId === state.destinationId) state.originId = null;
    state.result = null;
    state.routeCoordinates = [];
    renderControls();
    renderGraph();
    drawResult();
    renderResultSummary();
  });

  refs.weightSelect.addEventListener('change', (event) => {
    state.weightKey = event.target.value;
    state.result = null;
    state.routeCoordinates = [];
    renderGraph();
    drawResult();
    renderControls();
    renderResultSummary();
  });

  refs.toggleWeights.addEventListener('change', (event) => {
    state.showWeights = event.target.checked;
    renderGraph();
  });

  refs.toggleGraph.addEventListener('change', (event) => {
    state.showGraph = event.target.checked;
    renderGraph();
  });

  refs.btnClearSelection.addEventListener('click', () => {
    resetSelection();
    renderControls();
    renderGraph();
    drawResult();
    renderResultSummary();
    showToast('Selección limpiada.');
  });

  refs.btnFitMap.addEventListener('click', fitToGraph);
  refs.btnOpenControl.addEventListener('click', () => openMobilePanel('controls'));
  refs.btnCloseControl.addEventListener('click', () => refs.controlPanel.classList.remove('mobile-open'));
  refs.btnRunAlgorithm.addEventListener('click', runSelectedAlgorithm);
  refs.btnRefreshHistory.addEventListener('click', loadHistory);
  refs.btnDownloadResult.addEventListener('click', downloadResult);
  refs.graphFile.addEventListener('change', importGraphFile);

  document.querySelectorAll('[data-nav]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-nav]').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      openMobilePanel(button.dataset.nav);
    });
  });
}

function openMobilePanel(target) {
  refs.controlPanel.classList.remove('mobile-open');
  refs.resultsPanel.classList.remove('mobile-open');
  if (target === 'controls') refs.controlPanel.classList.add('mobile-open');
  if (target === 'history') refs.resultsPanel.classList.add('mobile-open');
}

export function renderControls() {
  refs.metricNodes.textContent = state.graph.nodes.length;
  refs.metricEdges.textContent = state.graph.edges.length;
  refs.weightSelect.value = state.weightKey;
  refs.toggleWeights.checked = state.showWeights;
  refs.toggleGraph.checked = state.showGraph;

  const options = ['<option value="">Selecciona nodo</option>']
    .concat(state.graph.nodes.map((node) => `<option value="${node.id}">${node.name}</option>`))
    .join('');
  refs.originSelect.innerHTML = options;
  refs.destinationSelect.innerHTML = options;
  refs.originSelect.value = state.originId || '';
  refs.destinationSelect.value = state.destinationId || '';

  refs.currentInstruction.textContent = state.originId && state.destinationId
    ? `${nodeLabel(state.originId)} → ${nodeLabel(state.destinationId)}`
    : state.originId
      ? `${nodeLabel(state.originId)} seleccionado`
      : 'Selecciona origen y destino';
  refs.algorithmStatus.innerHTML = `<span class="material-symbols-rounded">bolt</span> ${algorithmLabel(state.algorithm)}`;
  refs.algorithmExplanation.textContent = explanations[state.algorithm];

  const requiresRoute = state.algorithm === 'dijkstra';
  refs.destinationSelect.disabled = !requiresRoute;
  refs.btnRunAlgorithm.disabled = requiresRoute ? !(state.originId && state.destinationId) : false;
}

export function renderResultSummary() {
  const result = state.result;
  if (!result) {
    refs.resultTitle.textContent = 'Sin ejecución';
    refs.resultMessage.textContent = 'Calcula una ruta o un árbol mínimo para visualizar métricas y trazado.';
    refs.statCost.textContent = '—';
    refs.statVisited.textContent = '—';
    refs.statTime.textContent = '—';
    refs.floatingResult.innerHTML = '<span class="material-symbols-rounded">insights</span><div><strong>Sin cálculo activo</strong><small>Ejecuta un algoritmo para trazar el resultado.</small></div>';
    return;
  }

  refs.resultTitle.textContent = algorithmLabel(result.algorithm);
  refs.resultMessage.textContent = result.message || 'Resultado generado.';
  refs.statCost.textContent = formatCost(result.totalCost);
  refs.statVisited.textContent = result.visitedCount ?? '—';
  refs.statTime.textContent = `${Number(result.executionMs || 0).toFixed(2)} ms`;

  const typeLabel = result.algorithm === 'dijkstra' ? 'Ruta óptima' : 'Árbol mínimo';
  refs.floatingResult.innerHTML = `
    <span class="material-symbols-rounded">insights</span>
    <div><strong>${typeLabel}: ${formatCost(result.totalCost)}</strong><small>${result.message}</small></div>
  `;
}

export function renderHistory() {
  if (!state.history.length) {
    refs.historyList.innerHTML = '<p class="muted">Aún no hay ejecuciones registradas.</p>';
    return;
  }

  refs.historyList.innerHTML = state.history.map((item) => {
    const date = new Date(`${item.createdAt}Z`);
    const icon = item.algorithm === 'dijkstra' ? 'route' : 'hub';
    return `
      <article class="timeline-item">
        <span class="timeline-icon material-symbols-rounded">${icon}</span>
        <div>
          <strong>${algorithmLabel(item.algorithm)} · ${formatCost(item.totalCost)}</strong>
          <small>${Number(item.executionMs || 0).toFixed(2)} ms · ${date.toLocaleString()}</small>
          <p>${nodeLabel(item.originId)}${item.destinationId ? ` → ${nodeLabel(item.destinationId)}` : ''}</p>
        </div>
      </article>
    `;
  }).join('');
}

export function showToast(message) {
  if (!refs.toast) return;
  clearTimeout(toastTimeout);
  refs.toast.textContent = message;
  refs.toast.classList.add('show');
  toastTimeout = setTimeout(() => refs.toast.classList.remove('show'), 2600);
}

export async function runSelectedAlgorithm() {
  try {
    refs.btnRunAlgorithm.disabled = true;
    refs.btnRunAlgorithm.innerHTML = '<span class="material-symbols-rounded">progress_activity</span> Calculando...';
    const payload = {
      algorithm: state.algorithm,
      originId: state.originId,
      destinationId: state.destinationId,
      weightKey: state.weightKey
    };
    const data = await api.runAlgorithm(payload);
    if (data.graph) state.graph = data.graph;
    state.result = data.result;
    renderGraph();
    drawResult();
    renderResultSummary();
    await loadHistory();
    showToast(state.result.message);
  } catch (error) {
    showToast(error.message);
  } finally {
    refs.btnRunAlgorithm.innerHTML = '<span class="material-symbols-rounded">play_arrow</span> Calcular y trazar';
    renderControls();
  }
}

export async function loadHistory() {
  try {
    state.history = await api.getHistory();
    renderHistory();
  } catch (error) {
    showToast(error.message);
  }
}

function downloadResult() {
  if (!state.result) {
    showToast('No hay resultado para descargar.');
    return;
  }
  const blob = new Blob([JSON.stringify({ result: state.result, graph: state.graph }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `georutas-${state.result.algorithm}-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function importGraphFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const graph = JSON.parse(text);
    const imported = await api.importGraph(graph);
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
    showToast('Grafo importado correctamente.');
  } catch (error) {
    showToast(error.message);
  } finally {
    event.target.value = '';
  }
}
