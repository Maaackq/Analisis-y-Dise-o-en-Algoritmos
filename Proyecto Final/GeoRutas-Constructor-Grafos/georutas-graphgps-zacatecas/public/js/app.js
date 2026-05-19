import { api } from './api.js';
import { state } from './state.js';
import { initializeMap, renderGraph, fitToGraph } from './map.js';
import { bindDom, renderControls, renderResultSummary, loadHistory, showToast } from './ui.js';
import { initializeGraphBuilder } from './builder.js';

async function bootstrap() {
  try {
    initializeMap();
    bindDom();
    initializeGraphBuilder();
    const graph = await api.getGraph();
    state.graph = graph;
    renderControls();
    renderGraph();
    renderResultSummary();
    fitToGraph();
    await loadHistory();
    if (window.GeoRutasBuilder) window.GeoRutasBuilder.seedFromCurrentGraph();
    showToast('GeoRutas listo: crea, importa o ejecuta algoritmos sobre grafos.');
  } catch (error) {
    showToast(error.message);
  }
}

bootstrap();
