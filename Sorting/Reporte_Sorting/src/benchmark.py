import os
import random
import time
import matplotlib.pyplot as plt

from bubble_sort import bubble_sort
from selection_sort import selection_sort
from insertion_sort import insertion_sort
from merge_sort import merge_sort
from quick_sort import quick_sort
from random_quick_sort import random_quick_sort
from counting_sort import counting_sort
from radix_sort import radix_sort


ALGORITMOS = {
    "bubble": bubble_sort,
    "selection": selection_sort,
    "insertion": insertion_sort,
    "merge": merge_sort,
    "quick": quick_sort,
    "random_quick": random_quick_sort,
    "counting": counting_sort,
    "radix": radix_sort,
}


def generar_arreglo(n, caso="aleatorio"):
    arr = list(range(n))
    if caso == "aleatorio":
        random.shuffle(arr)
    elif caso == "invertido":
        arr.reverse()
    return arr


def ejecutar_algoritmo(algoritmo, arr):
    copia = arr[:]
    resultado = algoritmo(copia)

    if resultado is not None:
        return resultado
    return copia


def medir_tiempo(algoritmo, arr, repeticiones=10):
    tiempos = []

    for _ in range(repeticiones):
        inicio = time.perf_counter()
        ejecutar_algoritmo(algoritmo, arr)
        fin = time.perf_counter()
        tiempos.append(fin - inicio)

    return sum(tiempos) / len(tiempos)


def graficar_individual(resultados, nombre_algoritmo, salida):
    x = list(resultados.keys())
    y = list(resultados.values())

    plt.figure()
    plt.plot(x, y, marker="o")
    plt.xlabel("Tamaño de entrada (n)")
    plt.ylabel("Tiempo promedio (segundos)")
    plt.title(f"Desempeño experimental de {nombre_algoritmo}")
    plt.grid(True)
    plt.savefig(salida, bbox_inches="tight")
    plt.close()


def graficar_comparativa(resultados_globales, salida):
    plt.figure()

    for nombre_algoritmo, resultados in resultados_globales.items():
        x = list(resultados.keys())
        y = list(resultados.values())
        plt.plot(x, y, marker="o", label=nombre_algoritmo)

    plt.xlabel("Tamaño de entrada (n)")
    plt.ylabel("Tiempo promedio (segundos)")
    plt.title("Comparativa de algoritmos de ordenamiento")
    plt.grid(True)
    plt.legend()
    plt.savefig(salida, bbox_inches="tight")
    plt.close()


def main():
    tamanos = [100, 500, 1000, 2000]
    caso = "aleatorio"
    repeticiones = 10

    base_dir = os.path.dirname(__file__)
    graficas_dir = os.path.abspath(os.path.join(base_dir, "..", "graficas"))
    os.makedirs(graficas_dir, exist_ok=True)

    resultados_globales = {}

    for nombre, algoritmo in ALGORITMOS.items():
        resultados = {}

        for n in tamanos:
            arr = generar_arreglo(n, caso)
            promedio = medir_tiempo(algoritmo, arr, repeticiones=repeticiones)
            resultados[n] = promedio

        resultados_globales[nombre] = resultados

        salida_individual = os.path.join(graficas_dir, f"{nombre}.png")
        graficar_individual(resultados, nombre, salida_individual)
        print(f"Gráfica generada: {salida_individual}")

    salida_comparativa = os.path.join(graficas_dir, "comparativa.png")
    graficar_comparativa(resultados_globales, salida_comparativa)
    print(f"Gráfica comparativa generada: {salida_comparativa}")


if __name__ == "__main__":
    main()
