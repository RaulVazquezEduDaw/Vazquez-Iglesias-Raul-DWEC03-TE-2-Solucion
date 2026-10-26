export function mostrarResultados() {
	document.addEventListener('DOMContentLoaded', () => {
	    // Se obtiene la precisión final desde el sessionStorage
	    const precisionString = sessionStorage.getItem('precisionFinal');
	
	    // Control de seguridad: Si se intenta acceder sin haber jugado,
		// se redirige al index
	    accesoAutorizado(precisionString);
		// Nota: si llega a este punto, es que el acceso está autorizado.
		// En caso contrario, nunca llegará aquí porque cambiará a la vista de login.
		
		const porcentaje = parseInt(precisionString);
	    
		// Imprimir el porcentaje alcanzado
		const precisionDOM = document.getElementById('precision-valor');
	    precisionDOM.textContent = `${porcentaje}%`;
	
		// Mostrar el mensaje según el porcentaje de acierto conseguido
	    mostrarMensaje(porcentaje);
		
		// Acción del botón "JUGAR DE NUEVO"
		botonVolverAccion();
		
		// Acción del botón "SALIR"
		botonSalirAccion()
	});
}

/**
 * Controla si se trata de un acceso no autorizado (si precisionFinal es null)
 * En ese caso, redirige al usuario a la pantalla de login
 */
function accesoAutorizado(precisionString){	
	if (precisionString === null)
		window.location.href = '/index.html';
}

/**
 * Muestra un mensaje u otro dependiendo si el usuario ha completado el juego a tiempo o no
 */
function mostrarMensaje(porcentaje){
	const iconoDOM = document.getElementById('resultado-icono');
	const tituloDOM = document.getElementById('resultado-titulo');
	const mensajeDOM = document.getElementById('mensaje');
	
	if (porcentaje === 100) {
		// El usuario consiguió resolverlo antes de agotarse el tiempo
	    iconoDOM.textContent = '🏆';
	    tituloDOM.textContent = '¡COMPLETADO!';
	    mensajeDOM.textContent = '¡Enhorabuena!';
	    
	} else {
	    // El tiempo se ha agotado y la precisión es menor a 100
	    iconoDOM.textContent = '⏳';
	    tituloDOM.textContent = '¡TIEMPO AGOTADO!';
	    mensajeDOM.textContent = '¡Casi lo logras!';
	}
}

/**
 * Controla la acción sobre el botón "Jugar de nuevo"
 */
function botonVolverAccion(){
	const btnJugarNuevo = document.getElementById('btn-jugar-nuevo');
	btnJugarNuevo.addEventListener('click', () => {
	    // Elimina el progreso de la partida actual pero manteniendo al usuario logueado
	    limpiaPrecisionFinalDelSessionStorage();
	    
	    // Redirige al usuario a la pantalla de instrucciones para volver a elegir dificultad
	    window.location.href = 'instrucciones.html';
	});
}

/**
 * Controla la acción sobre el botón "Salir"
 */
function botonSalirAccion(){
	const btnJugarNuevo = document.getElementById('btn-salir');
	btnJugarNuevo.addEventListener('click', () => {
	    // Elimina el progreso de la partida actual
	    limpiaPrecisionFinalDelSessionStorage();
	    
	    // Redirige al usuario a la pantalla de login
	    window.location.href = '/index.html';
	});
}

function limpiaPrecisionFinalDelSessionStorage(){
		sessionStorage.removeItem('precisionFinal');
}