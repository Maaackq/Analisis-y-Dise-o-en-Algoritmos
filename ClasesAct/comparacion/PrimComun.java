import java.util.*;

public class PrimComun {

    static class Arista {
        int destino, peso;

        Arista(int destino, int peso) {
            this.destino = destino;
            this.peso = peso;
        }
    }

    static void agregarArista(List<List<Arista>> grafo, int origen, int destino, int peso) {
        grafo.get(origen).add(new Arista(destino, peso));
        grafo.get(destino).add(new Arista(origen, peso));
    }

    static int prim(List<List<Arista>> grafo, int vertices) {
        boolean[] visitado = new boolean[vertices];
        PriorityQueue<Arista> cola = new PriorityQueue<>(Comparator.comparingInt(a -> a.peso));

        int pesoTotal = 0;
        int aristasUsadas = 0;

        visitado[0] = true;
        cola.addAll(grafo.get(0));

        while (!cola.isEmpty() && aristasUsadas < vertices - 1) {
            Arista actual = cola.poll();

            if (visitado[actual.destino]) {
                continue;
            }

            visitado[actual.destino] = true;
            pesoTotal += actual.peso;
            aristasUsadas++;

            for (Arista arista : grafo.get(actual.destino)) {
                if (!visitado[arista.destino]) {
                    cola.add(arista);
                }
            }
        }

        return pesoTotal;
    }

    public static void main(String[] args) {
        int vertices = 6;

        List<List<Arista>> grafo = new ArrayList<>();

        for (int i = 0; i < vertices; i++) {
            grafo.add(new ArrayList<>());
        }

        // Grafo común
        agregarArista(grafo, 0, 1, 4);
        agregarArista(grafo, 0, 2, 3);
        agregarArista(grafo, 1, 2, 1);
        agregarArista(grafo, 1, 3, 2);
        agregarArista(grafo, 2, 3, 4);
        agregarArista(grafo, 3, 4, 2);
        agregarArista(grafo, 4, 5, 6);
        agregarArista(grafo, 3, 5, 3);

        long inicio = System.nanoTime();
        int resultado = prim(grafo, vertices);
        long fin = System.nanoTime();

        System.out.println("=== Algoritmo de Prim ===");
        System.out.println("Peso del MST: " + resultado);
        System.out.println("Tiempo: " + (fin - inicio) + " ns");
    }
}