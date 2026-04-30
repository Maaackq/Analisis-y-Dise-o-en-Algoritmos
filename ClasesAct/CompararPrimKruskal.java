import java.util.*;

public class CompararPrimKruskal {

    static class Arista implements Comparable<Arista> {
        int origen, destino, peso;

        Arista(int origen, int destino, int peso) {
            this.origen = origen;
            this.destino = destino;
            this.peso = peso;
        }

        public int compareTo(Arista otra) {
            return this.peso - otra.peso;
        }
    }

    static class UnionFind {
        int[] padre, rango;

        UnionFind(int n) {
            padre = new int[n];
            rango = new int[n];

            for (int i = 0; i < n; i++) {
                padre[i] = i;
            }
        }

        int encontrar(int x) {
            if (padre[x] != x) {
                padre[x] = encontrar(padre[x]);
            }
            return padre[x];
        }

        boolean unir(int a, int b) {
            int raizA = encontrar(a);
            int raizB = encontrar(b);

            if (raizA == raizB) {
                return false;
            }

            if (rango[raizA] < rango[raizB]) {
                padre[raizA] = raizB;
            } else if (rango[raizA] > rango[raizB]) {
                padre[raizB] = raizA;
            } else {
                padre[raizB] = raizA;
                rango[raizA]++;
            }

            return true;
        }
    }

    static int prim(int vertices, List<List<Arista>> grafo) {
        boolean[] visitado = new boolean[vertices];
        PriorityQueue<Arista> cola = new PriorityQueue<>();

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

    static int kruskal(int vertices, List<Arista> aristas) {
        Collections.sort(aristas);

        UnionFind uf = new UnionFind(vertices);
        int pesoTotal = 0;
        int aristasUsadas = 0;

        for (Arista arista : aristas) {
            if (uf.unir(arista.origen, arista.destino)) {
                pesoTotal += arista.peso;
                aristasUsadas++;

                if (aristasUsadas == vertices - 1) {
                    break;
                }
            }
        }

        return pesoTotal;
    }

    static void agregarArista(
            List<List<Arista>> grafo,
            List<Arista> aristas,
            int origen,
            int destino,
            int peso
    ) {
        grafo.get(origen).add(new Arista(origen, destino, peso));
        grafo.get(destino).add(new Arista(destino, origen, peso));

        aristas.add(new Arista(origen, destino, peso));
    }

    public static void main(String[] args) {
        int vertices = 6;

        List<List<Arista>> grafo = new ArrayList<>();
        List<Arista> aristas = new ArrayList<>();

        for (int i = 0; i < vertices; i++) {
            grafo.add(new ArrayList<>());
        }

        // Mismo grafo para Prim y Kruskal
        agregarArista(grafo, aristas, 0, 1, 4);
        agregarArista(grafo, aristas, 0, 2, 3);
        agregarArista(grafo, aristas, 1, 2, 1);
        agregarArista(grafo, aristas, 1, 3, 2);
        agregarArista(grafo, aristas, 2, 3, 4);
        agregarArista(grafo, aristas, 3, 4, 2);
        agregarArista(grafo, aristas, 4, 5, 6);
        agregarArista(grafo, aristas, 3, 5, 3);

        long inicioPrim = System.nanoTime();
        int resultadoPrim = prim(vertices, grafo);
        long finPrim = System.nanoTime();

        long tiempoPrim = finPrim - inicioPrim;

        long inicioKruskal = System.nanoTime();
        int resultadoKruskal = kruskal(vertices, new ArrayList<>(aristas));
        long finKruskal = System.nanoTime();

        long tiempoKruskal = finKruskal - inicioKruskal;

        System.out.println("===== Comparacion Prim vs Kruskal =====");
        System.out.println("Mismo grafo usado en ambas implementaciones");
        System.out.println();

        System.out.println("Resultado Prim: " + resultadoPrim);
        System.out.println("Tiempo Prim: " + tiempoPrim + " ns");

        System.out.println();

        System.out.println("Resultado Kruskal: " + resultadoKruskal);
        System.out.println("Tiempo Kruskal: " + tiempoKruskal + " ns");

        System.out.println();

        if (tiempoPrim < tiempoKruskal) {
            System.out.println("Prim fue mas rapido.");
        } else if (tiempoKruskal < tiempoPrim) {
            System.out.println("Kruskal fue mas rapido.");
        } else {
            System.out.println("Ambos tardaron lo mismo.");
        }
    }
}