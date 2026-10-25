import {
    COLOR_GOMA,
    crearEstadoPartida,
    calcularPorcentajeAcierto
} from '../models/juegoModel.js';

let intervaloTiempo = null;

/**
 * Inicializa la partida según el estado de dificultad
 */
export function mostrarJuego() {
    const dificultad = sessionStorage.getItem('nivelDificultad') || 'principiante';

    // Obtenemos el estado inicial desde el modelo
    const estado = crearEstadoPartida(dificultad);

    const uiAcierto = document.getElementById('acierto');

    // Inicializar el juego
    generarPaleta(estado);
    generarTableros(estado, uiAcierto);
    iniciarTemporizador(estado.config.time, uiAcierto);
	escucharTeclado(estado); // Cambia el color del pincel con el teclado (keydown)
}

/**
 * Construye celda a celda las dos cuadrículas en el HTML (el modelo y el lienzo) y
 * asocia a cada una los eventos de la mecánica del juego
 */
function generarTableros(estado, uiAcierto) {
    const contModelo = document.getElementById('contenedor-modelo');
    const contLienzo = document.getElementById('contenedor-lienzo');

    const tablaModelo = document.createElement('table');
    const tablaLienzo = document.createElement('table');
    tablaModelo.className = 'lienzo-tabla';
    tablaLienzo.className = 'lienzo-tabla';

	// Generación del tablero de juego (tablaModelo y tablaLienzo)
    for (let f = 0;f < estado.config.size;f++) {
        const trModelo = document.createElement('tr');
        const trLienzo = document.createElement('tr');

        for (let c = 0;c < estado.config.size;c++) {
            // Celda del Modelo
            const tdMod = document.createElement('td');
            tdMod.className = 'lienzo-celda';
            if (estado.modelo[f][c] !== COLOR_GOMA) {
                tdMod.style.backgroundColor = estado.modelo[f][c];
            }
            trModelo.appendChild(tdMod);

            // Celda del Lienzo (Jugador)
            const tdLienzo = document.createElement('td');
            tdLienzo.className = 'lienzo-celda';

			/**
			* EVENTOS QUE INCUÍ EN LA TAREA: DWEC03-TE-1
			*/
            // 1. Clic izquierdo para pintar (mousedown)           
            tdLienzo.addEventListener('mousedown', (e) => {
                if (e.button === 0)
					pintarCelda(tdLienzo, f, c, estado, uiAcierto);
            });

            // 2. Arrastrar para pintar (mouseenter)
            tdLienzo.addEventListener('mouseenter', (e) => {
                if (e.buttons === 1)
					pintarCelda(tdLienzo, f, c, estado, uiAcierto);
            });
			
			// 3. Cambia el color del pincel con el teclado (keydown)
			// Se llama a esta función una sola vez desde la función mostrarJuego().
			// Pongo aquí el comentario para que se vean juntos los cuatro eventos del PDF
			
            // 4. Clic derecho para borrar (contextmenu)
            tdLienzo.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                borrarCelda(tdLienzo, f, c, estado, uiAcierto);
            });
			
            trLienzo.appendChild(tdLienzo);
        }
        tablaModelo.appendChild(trModelo);
        tablaLienzo.appendChild(trLienzo);
    }
	
	// Inserción en el DOM de tablaModelo y tablaLienzo una vez generadas
    contModelo.replaceChildren(tablaModelo);
    contLienzo.replaceChildren(tablaLienzo);
}

/**
 * Pinta la celda del color seleccionado
 */
function pintarCelda(elementoTD, fila, col, estado, uiAcierto) {
    elementoTD.style.backgroundColor = estado.colorSeleccionadoHex;
    estado.lienzo[fila][col] = estado.colorSeleccionadoHex;
    actualizarAciertoUI(estado, uiAcierto);
}

/**
* Pinta la celda del color "GOMA" (blanco)
*/
function borrarCelda(elementoTD, fila, col, estado, uiAcierto) {
    elementoTD.style.backgroundColor = COLOR_GOMA;
    estado.lienzo[fila][col] = COLOR_GOMA;
    actualizarAciertoUI(estado, uiAcierto);
}

/**
 * Pinta el acierto cada vez que el usuario pinta una celda
 * Si el usuario completa el juego => termina
 */
function actualizarAciertoUI(estado, uiAcierto) {
    const porcentaje = calcularPorcentajeAcierto(estado);
    uiAcierto.textContent = porcentaje + '%';

    // Si acierta el 100% antes de tiempo => termina
    if (porcentaje === 100)
        finalizarJuego(uiAcierto);
}


/**
 * Construye dinámicamente en el DOM los botones de paleta de colores y la goma de borrar
 */
function generarPaleta(estado) {
    const contenedor = document.getElementById('paleta-contenedor');
    contenedor.innerHTML = ''; // Limpia el contenido previo del contenedor

	// Itero sobre el array de colores. 
	// En cada iteración recibe el objeto color y su posición o índice (index).
    estado.coloresNivel.forEach((color, index) => {
        const div = document.createElement('div');
        div.className = `color-btn ${index === 0 ? 'activo' : ''}`;
        div.dataset.hex = color.hex;
        div.innerHTML = `
            <div class="color-box" style="background-color: ${color.hex}"></div>
            <span>${color.id} - ${color.nombre}</span>
        `;

        // Permitir seleccionar clicando en la paleta (Extra al teclado)
        div.addEventListener('click', () => cambiarColorActivo(color.hex, div, estado));
        contenedor.appendChild(div);
    });

    // Botón visual de la goma
    const divGoma = document.createElement('div');
    divGoma.className = 'color-btn';
    divGoma.innerHTML = `
        <div class="color-box" style="background-color: white"></div>
        <span>${estado.coloresNivel.length + 1} - Goma</span>
    `;
    divGoma.addEventListener('click', () => cambiarColorActivo(COLOR_GOMA, divGoma, estado));
    contenedor.appendChild(divGoma);
}

/**
 * Cambia el color activo
 */
function cambiarColorActivo(hex, elementoBoton, estado) {
    estado.colorSeleccionadoHex = hex;
    
	// Quitar activo a todos
    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('activo'));
    
	// Activa el seleccionado
	if (elementoBoton)
		elementoBoton.classList.add('activo');
}

/**
 * Recibe el tiempo y pinta segundo a segundo el tiempo restante
 * Cuando acaba el tiempo, finaliza el juego.
 */
function iniciarTemporizador(tiempoRestante, uiAcierto) {
    const uiTiempo = document.getElementById('tiempo');
    uiTiempo.textContent = tiempoRestante + 's';

    if (intervaloTiempo)
		clearInterval(intervaloTiempo);

    intervaloTiempo = setInterval(() => {
        tiempoRestante--;
        uiTiempo.textContent = tiempoRestante + 's';
		
		// Cuando acaba el tiempo => finaliza el juego
        if (tiempoRestante <= 0) {
            clearInterval(intervaloTiempo);
            finalizarJuego(uiAcierto);
        }
    }, 1000);
}

/**
 * Recibe el porcentaje de acierto del DOM, lo guarda en el sessionStorage y
 * redirige a la pantalla de resultados
 */
function finalizarJuego(uiAcierto) {
    if (intervaloTiempo)
		clearInterval(intervaloTiempo);
	
    sessionStorage.setItem('precisionFinal', parseInt(uiAcierto.textContent) || 0);
    window.location.href = 'resultados.html';
}

/**
 * Cambia el color del pincel con el teclado (1 a coloresNivel.length)
 * o a la goma (coloresNivel.length + 1)
 * 
 * Evento: keydown
 */
function escucharTeclado(estado) {
    document.addEventListener('keydown', (e) => {
        const teclaNumero = parseInt(e.key);
        const botones = document.querySelectorAll('.color-btn');

        // Si pulsa un número dentro del rango de colores
        if (teclaNumero >= 1 && teclaNumero <= estado.coloresNivel.length) {
            const colorObj = estado.coloresNivel[teclaNumero - 1];
            cambiarColorActivo(colorObj.hex, botones[teclaNumero - 1], estado);
        }
        // Si pulsa el número correspondiente a la Goma (N + 1) 
        else if (teclaNumero === estado.coloresNivel.length + 1) {
            cambiarColorActivo(COLOR_GOMA, botones[botones.length - 1], estado);
        }
    });
}