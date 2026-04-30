import java.util.*;

public class ComparacionPrimKruskal {

    static class Arista implements Comparable<Arista> {
        int origen, destino, peso;

        Arista(int origen, int destino, int peso) {
            this.origen = origen;
            this.destino = destino;
            this.peso = peso;
        }

        @Override
        public int compareTo(Arista otra) {
            return Integer.compare(this.peso, otra.peso);
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

            if (raizA == raizB) return false;

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

    static class Grafo {
        int vertices;
        List<List<Arista>> listaAdyacencia;
        List<Arista> aristas;

        Grafo(int vertices) {
            this.vertices = vertices;
            listaAdyacencia = new ArrayList<>();
            aristas = new ArrayList<>();

            for (int i = 0; i < vertices; i++) {
                listaAdyacencia.add(new ArrayList<>());
            }
        }

        void agregarArista(int origen, int destino, int peso) {
            listaAdyacencia.get(origen).add(new Arista(origen, destino, peso));
            listaAdyacencia.get(destino).add(new Arista(destino, origen, peso));
            aristas.add(new Arista(origen, destino, peso));
        }
    }

    static int prim(Grafo grafo) {
        boolean[] visitado = new boolean[grafo.vertices];
        PriorityQueue<Arista> cola = new PriorityQueue<>();

        int pesoTotal = 0;
        int aristasUsadas = 0;

        visitado[0] = true;
        cola.addAll(grafo.listaAdyacencia.get(0));

        while (!cola.isEmpty() && aristasUsadas < grafo.vertices - 1) {
            Arista actual = cola.poll();

            if (visitado[actual.destino]) continue;

            visitado[actual.destino] = true;
            pesoTotal += actual.peso;
            aristasUsadas++;

            for (Arista arista : grafo.listaAdyacencia.get(actual.destino)) {
                if (!visitado[arista.destino]) {
                    cola.add(arista);
                }
            }
        }

        return pesoTotal;
    }

    static int kruskal(Grafo grafo) {
        List<Arista> aristasOrdenadas = new ArrayList<>(grafo.aristas);
        Collections.sort(aristasOrdenadas);

        UnionFind uf = new UnionFind(grafo.vertices);

        int pesoTotal = 0;
        int aristasUsadas = 0;

        for (Arista arista : aristasOrdenadas) {
            if (uf.unir(arista.origen, arista.destino)) {
                pesoTotal += arista.peso;
                aristasUsadas++;

                if (aristasUsadas == grafo.vertices - 1) break;
            }
        }

        return pesoTotal;
    }

    static Grafo generarGrafoDisperso(int vertices) {
        Grafo grafo = new Grafo(vertices);
        Random random = new Random(1);

        // 🔹 Arista común
        grafo.agregarArista(0, 1, 10);

        // Conexión base
        for (int i = 1; i < vertices - 1; i++) {
            grafo.agregarArista(i, i + 1, random.nextInt(100) + 1);
        }

        // Pocas aristas extra
        for (int i = 0; i < vertices; i++) {
            int a = random.nextInt(vertices);
            int b = random.nextInt(vertices);

            if (a != b) {
                grafo.agregarArista(a, b, random.nextInt(100) + 1);
            }
        }

        return grafo;
    }

    static Grafo generarGrafoDenso(int vertices) {
        Grafo grafo = new Grafo(vertices);
        Random random = new Random(1);

        // 🔹 Arista común
        grafo.agregarArista(0, 1, 10);

        // Conexión base
        for (int i = 1; i < vertices - 1; i++) {
            grafo.agregarArista(i, i + 1, random.nextInt(100) + 1);
        }

        int maxAristas = vertices * (vertices - 1) / 2;
        int aristasDeseadas = Math.min(maxAristas, vertices * 10);

        while (grafo.aristas.size() < aristasDeseadas) {
            int a = random.nextInt(vertices);
            int b = random.nextInt(vertices);

            if (a != b) {
                grafo.agregarArista(a, b, random.nextInt(100) + 1);
            }
        }

        return grafo;
    }

    static long medirPrim(Grafo grafo) {
        long inicio = System.nanoTime();
        prim(grafo);
        return System.nanoTime() - inicio;
    }

    static long medirKruskal(Grafo grafo) {
        long inicio = System.nanoTime();
        kruskal(grafo);
        return System.nanoTime() - inicio;
    }

    static void comparar(String tipo, Grafo grafo, int repeticiones) {
        long totalPrim = 0;
        long totalKruskal = 0;

        int resultadoPrim = prim(grafo);
        int resultadoKruskal = kruskal(grafo);

        for (int i = 0; i < repeticiones; i++) {
            totalPrim += medirPrim(grafo);
            totalKruskal += medirKruskal(grafo);
        }

        long promedioPrim = totalPrim / repeticiones;
        long promedioKruskal = totalKruskal / repeticiones;

        String ganador = (promedioPrim < promedioKruskal) ? "Prim"
                : (promedioKruskal < promedioPrim) ? "Kruskal" : "Empate";

        System.out.printf(
                "%-10s %-10d %-10d %-15d %-15d %-10s %-10s%n",
                tipo,
                grafo.vertices,
                grafo.aristas.size(),
                promedioPrim,
                promedioKruskal,
                ganador,
                resultadoPrim == resultadoKruskal ? "OK" : "ERROR"
        );
    }

    public static void main(String[] args) {
        int[] tamanios = {100, 300, 500, 1000};
        int repeticiones = 10;

        System.out.println("===== Comparacion Prim vs Kruskal =====");
        System.out.println("Arista común: (0 - 1, peso 10)");
        System.out.println("Tiempo promedio en nanosegundos\n");

        System.out.printf(
                "%-10s %-10s %-10s %-15s %-15s %-10s %-10s%n",
                "Tipo", "Vertices", "Aristas",
                "Prim(ns)", "Kruskal(ns)", "Ganador", "MST"
        );

        System.out.println("--------------------------------------------------------------------------");

        for (int v : tamanios) {
            comparar("Disperso", generarGrafoDisperso(v), repeticiones);
            comparar("Denso", generarGrafoDenso(v), repeticiones);
        }
    }
}