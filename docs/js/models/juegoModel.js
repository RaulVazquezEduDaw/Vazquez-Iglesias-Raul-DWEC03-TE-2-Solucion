export const COLOR_GOMA = '#FFFFFF';

/**
 * Crea y devuelve el objeto de estado según la dificultad seleccionada por el usuario
 * @return Objeto de estado inicial según la dificultad seleccionada
 */
export function crearEstadoPartida(dificultadNombre) {
	// Configuraciones de juego según la dificultad
	const CONFIGS = {
	    principiante: { size: 5, numColors: 2, time: 60 },
	    intermedio: { size: 8, numColors: 4, time: 90 },
	    avanzado: { size: 12, numColors: 6, time: 120 }
	};
	
	const COLORES_DISPONIBLES = [
	    { id: 1, hex: '#E23D28', nombre: 'Rojo' },
	    { id: 2, hex: '#285CC4', nombre: 'Azul' },
	    { id: 3, hex: '#1A1A1A', nombre: 'Negro' },
	    { id: 4, hex: '#417B69', nombre: 'Verde' },
	    { id: 5, hex: '#F2C94C', nombre: 'Naranja' },
	    { id: 6, hex: '#9B51E0', nombre: 'Morado' }
	];
	
	// Configuración actual (según la elegida)
    const config = CONFIGS[dificultadNombre]; 
    const coloresNivel = COLORES_DISPONIBLES.slice(0, config.numColors);
	
	// Inicialización del estado inicial del juego
    const estado = {
        config: config,
        coloresNivel: coloresNivel,
        colorSeleccionadoHex: coloresNivel[0].hex,
        modelo: [],
        lienzo: []
    };
	
    // Generar matrices del modelo y del lienzo vacío
    for (let filaActual = 0;filaActual < config.size;filaActual++) {
        let filaModelo = [];
        for (let columnaActual = 0;columnaActual < config.size;columnaActual++) {
            // 30% de probabilidad de ser blanco, 70% de tener color
            if (Math.random() > 0.3) {
                const colorAleatorio = coloresNivel[Math.floor(Math.random() * coloresNivel.length)].hex;
                filaModelo.push(colorAleatorio);
			} else {
                filaModelo.push(COLOR_GOMA); // Celda color blanco
            }
        }
        estado.modelo.push(filaModelo); // Añade la fila a la matriz del modelo
        estado.lienzo.push(new Array(config.size).fill(COLOR_GOMA)); // Añade la fila "vacía" a la matriz del lienzo
    }
	
    return estado;
}

/**
 * Calcula el porcentaje de coincidencia entre el modelo y el lienzo del jugador
 * @return Porcentaje de coincidencia entre el modelo y el lienzo del jugador
 */
export function calcularPorcentajeAcierto(estado) {
    let aciertos = 0;
    const size = estado.config.size;
    const totalCeldas = size * size;
	
	// Recorro cada celda para calcular el número de coincidencias
	// entre el modelo y el lienzo del jugador
    for (let f = 0;f < size;f++) {
        for (let c = 0;c < size;c++) {
            if (estado.modelo[f][c] === estado.lienzo[f][c]) {
                aciertos++;
            }
        }
    }
	
    return Math.floor((aciertos / totalCeldas) * 100);
}
