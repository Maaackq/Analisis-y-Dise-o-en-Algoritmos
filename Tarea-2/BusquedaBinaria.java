public int busquedaBinaria(int[] arr, int objetivo) {
    // Complejidad temporal: O(log n)
    // Complejidad espacial: O(1)  → solo usa unas pocas variables enteras
    
    int izquierda = 0;                    // O(1)
    int derecha = arr.length - 1;         // O(1)
    
    // Bucle principal: O(log n) iteraciones × O(1) trabajo por iteración = O(log n)
    while (izquierda <= derecha) {
        int medio = izquierda + (derecha - izquierda) / 2;  // O(1)
        
        // Comparación clave: O(1)
        if (arr[medio] == objetivo) {
            return medio;                 // Éxito temprano
        }
        
        // Decisión: eliminar mitad del espacio restante
        if (arr[medio] < objetivo) {
            izquierda = medio + 1;        // O(1)
        } else {
            derecha = medio - 1;          // O(1)
        }
    }
    
    // No encontrado después de agotar las posibilidades
    return -1;                            // O(1)
}