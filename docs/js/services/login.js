import { elUsuarioExiste } from '../models/loginModel.js';

/**
 * Evalúa los input del usuario, busca el usuario y contraseña en el localStorage
 * muestra error si es necesario, activa al usuario en el sessionStorage
 * y redirige a la página de instrucciones.
 * @return true si se ha realizado el login con éxito
 * 		   false si NO se ha realizado el login
 */
export function iniciarLogin() {
    // Elementos del formulario
    const form = document.querySelector('form');
    const inputUsuario = document.querySelector('input[type="text"]');
    const inputPassword = document.querySelector('input[type="password"]');
	
	let loginIniciado = false;
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Se evita que se envíen los datos del formulario mediante petición GET.
		
		const valUsuario = inputUsuario.value.trim();
		const valPassword = inputPassword.value.trim();
		
		if (!hayCamposVacios(valUsuario, valPassword, inputUsuario, inputPassword)){
	        // Si no hay campos vacios, busca al usuario en el localStorage
			// Si lo encuentra, redirige a la página de instrucciones
	        if (elUsuarioExiste(valUsuario, valPassword)) {
	            window.location.href = 'html/instrucciones.html';
				loginIniciado = true;
			} else{
				mostrarErrorCredenciales();
			}
		}
    });
	
	return loginIniciado;
}

/**
 * Valida si hay algún campo vacío
 * @return true si hay algún campo vacío
 * 		   false si no hay campos vacíos
 */
function hayCamposVacios(valUsuario, valPassword, inputUsuario, inputPassword) {
	let hayVacios = false;

	if (!valUsuario) {
	    mostrarErrorCampoVacio(inputUsuario);
	    hayVacios = true;
	}

	if (!valPassword) {
	    mostrarErrorCampoVacio(inputPassword);
	    hayVacios = true;
	}

	return hayVacios;
}

/**
 * Muestra el mensaje "Completa este campo" si al pulsar "Entrar" hay algún campo vacío
 * Se activa el estilo input-error-empty para mostrar los bordes de color naranja.
 */
function mostrarErrorCampoVacio(inputElement) {
    inputElement.classList.add('input-error-empty');

    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip-empty';
    tooltip.textContent = 'Completa este campo';

    inputElement.parentElement.appendChild(tooltip);
	
	// Ocultar mensaje y quitar borde de error tras 3 segundos
	setTimeout(() => {
	    tooltip.remove();
	    inputElement.classList.remove('input-error-empty');
	}, 3000);
}

/**
 * Si el usuario y/o contraseña no coincide con uno de los usuarios guardados,
 * se mostrará el un error div con clase error-message-box en el contenedor del
 * botón de submit.
 */
function mostrarErrorCredenciales() {
    // Evita duplicar la caja roja si ya existía una
	if (document.querySelector('.error-message-box'))
		errorBox.remove();
	
	// Crea el elemento
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message-box';
    errorDiv.textContent = 'USUARIO O CONTRASEÑA INCORRECTOS';
	
	// Introduce el elemento debajo del botón
    const btnContainer = document.querySelector('.btn-container');
    btnContainer.after(errorDiv);
}