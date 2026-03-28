# REPORTE DE MEDICIÓN EXPERIMENTAL Y ANÁLISIS DE SISTEMAS

## Portada

- Nombre: Luis Miguel García Varela
- Materia: Análisis y Diseño de Algoritmos
- Grupo: 4-A
- Título: "Reporte de de medición experimental y análisis de sistemas"

---

## 1. Introducción

En el presente reporte se analiza el comportamiento de los algoritmos de ordenamiento mostrados en la página de VisuAlgo. El objetivo es estudiar su funcionamiento, explicar su complejidad mediante notación Big O y comparar su desempeño con base en medición experimental.

---

## 2. Metodología

Para realizar la medición experimental se implementaron los algoritmos en Python y se ejecutaron en Visual Studio Code bajo las mismas condiciones de prueba.

Se usaron:
- Tamaños de entrada: 100, 500, 1000 y 2000 elementos
- Caso de prueba: datos aleatorios
- Repeticiones por tamaño: 10
- Medida: tiempo promedio de ejecución
- Salida: gráfica individual por algoritmo y una gráfica comparativa

---

## 3. Análisis de los algoritmos

### 3.1 Bubble Sort
Bubble Sort compara elementos adyacentes e intercambia cuando están en desorden.

**Big O:**
- Mejor caso: O(n)
- Peor caso: O(n²)

**Desglose:**
El algoritmo usa dos recorridos anidados. En el peor caso realiza:
(n-1) + (n-2) + ... + 1 = n(n-1)/2
Por ello su crecimiento es cuadrático.

### 3.2 Selection Sort
Selection Sort busca el menor elemento restante y lo coloca en la posición correcta.

**Big O:**
- Mejor caso: O(n²)
- Peor caso: O(n²)

**Desglose:**
Aunque el arreglo ya esté ordenado, sigue buscando el mínimo en cada iteración.
Eso produce un número de comparaciones proporcional a n².

### 3.3 Insertion Sort
Insertion Sort toma cada elemento y lo inserta en su posición correcta dentro de la parte ya ordenada.

**Big O:**
- Mejor caso: O(n)
- Peor caso: O(n²)

**Desglose:**
Si el arreglo ya está ordenado, solo compara una vez por elemento.
Si está invertido, cada elemento debe desplazarse muchas veces.

### 3.4 Merge Sort
Merge Sort divide el problema en partes más pequeñas, las ordena y luego las combina.

**Big O:**
- Mejor caso: O(n log n)
- Peor caso: O(n log n)

**Desglose:**
El arreglo se divide en log n niveles y en cada nivel se procesan n elementos.
Por eso el tiempo total es O(n log n).

### 3.5 Quick Sort
Quick Sort selecciona un pivote y separa el arreglo en menores y mayores al pivote.

**Big O:**
- Mejor caso: O(n log n)
- Peor caso: O(n²)

**Desglose:**
Si el pivote divide bien, se tienen particiones balanceadas.
Si divide mal, una parte queda casi vacía y aparece un comportamiento cuadrático.

### 3.6 Random Quick Sort
Es una variante de Quick Sort que elige el pivote aleatoriamente.

**Big O:**
- Esperado: O(n log n)
- Peor caso: O(n²)

**Desglose:**
Al elegir el pivote al azar, disminuye la probabilidad de caer constantemente en malas particiones.

### 3.7 Counting Sort
Counting Sort cuenta cuántas veces aparece cada valor.

**Big O:**
- O(n + k)

**Desglose:**
Recorre el arreglo para contar y luego recorre el arreglo de conteo para reconstruir la salida.
Su costo depende de n y del rango k de valores posibles.

### 3.8 Radix Sort
Radix Sort ordena por dígitos, desde el menos significativo hasta el más significativo.

**Big O:**
- O(w(n + k))

**Desglose:**
Si hay w dígitos, se realiza un Counting Sort por cada dígito.
Por eso el tiempo total depende del número de dígitos y del rango.

---

## 4. Resultados experimentales

En esta sección se deben insertar las gráficas generadas automáticamente en la carpeta `graficas`.

Gráficas esperadas:
- bubble.png
- selection.png
- insertion.png
- merge.png
- quick.png
- random_quick.png
- counting.png
- radix.png
- comparativa.png

---

## 5. Análisis comparativo

A partir de los resultados experimentales y del análisis teórico se observa lo siguiente:

- Bubble Sort, Selection Sort e Insertion Sort son algoritmos sencillos, pero para entradas grandes su crecimiento es más lento debido a que son cuadráticos en el peor caso.
- Merge Sort y Quick Sort presentan mejor comportamiento para volúmenes grandes de datos.
- Random Quick Sort reduce el riesgo práctico del peor caso de Quick Sort.
- Counting Sort y Radix Sort pueden ser muy eficientes cuando los datos cumplen las condiciones necesarias para aplicarlos.

En general, los algoritmos O(n log n) escalan mejor que los O(n²), mientras que los no comparativos pueden superar a ambos bajo ciertas restricciones.

---

## 6. Conclusión

La medición experimental permitió comprobar que la teoría de complejidad se refleja en la práctica. Los algoritmos cuadráticos aumentan su tiempo con mayor rapidez conforme crece el tamaño de entrada, mientras que Merge Sort, Quick Sort y Random Quick Sort mantienen un crecimiento más controlado.

Counting Sort y Radix Sort muestran ventajas cuando el tipo de datos lo permite. Por ello, la elección del algoritmo depende tanto del tamaño de entrada como de las características de los datos a ordenar.
