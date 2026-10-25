export function mostrarInstrucciones() {
	document.addEventListener('DOMContentLoaded', () => {
	
	    // Efecto visual de selección de dificultad
	    visualSelectorDeDificultad();
	
	    // Cuando el usuario pulsa el botón ¡Empezar!, se guarda el nivel de dificultad
		// en el sessionStorage y se dirige al usuario al juego
	    enviarFormulario();
	});
}

/**
 * Efecto visual de selección de dificultad
 */
function visualSelectorDeDificultad(){
	const diffOptions = document.querySelectorAll('.diff-option');
    const radios = document.querySelectorAll('input[name="dificultad"]');

    radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            // Elimina la clase 'selected' de todas las opciones
            diffOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Añade la clase 'selected' solo al div padre del radio button marcado
            e.target.closest('.diff-option').classList.add('selected');
        });
    });
}

/**
 * Cuando el usuario pulsa el botón ¡Empezar!, se guarda el nivel de dificultad
 * en el sessionStorage y se dirige al usuario al juego
 */
function enviarFormulario(){
	const formDificultad = document.getElementById('form-dificultad');

	formDificultad.addEventListener('submit', (e) => {
	    e.preventDefault(); // Se evita que se envíen los datos del formulario mediante petición GET.
	    
	    // Se obtiene el nivel de dificultad
	    const radioSeleccionado = document.querySelector('input[name="dificultad"]:checked');
	    
        // Guarda el nivel de dificultad en el sessionStorage
        sessionStorage.setItem('nivelDificultad', radioSeleccionado.value);
        
		// Redirige al juego
        window.location.href = 'juego.html';     
	});
}