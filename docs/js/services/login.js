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
			if(esCorrectoElFormatoDeLaPassword(valPassword, inputPassword)){
				// Si no hay campos vacios y el formato de la contraseña es correcto, busca al usuario en el localStorage
				// Si lo encuentra, redirige a la página de instrucciones
		        if (elUsuarioExiste(valUsuario, valPassword)) {
		            window.location.href = 'html/instrucciones.html';
					loginIniciado = true;
				} else{
					// El usuario y contraseña no coinciden con ninguno de los existentes en el localStorage
					mostrarErrorCredenciales();
				}
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
	const errorMsg = 'Completa este campo';

	if (!valUsuario) {
		mostrarErrorEnCampo(inputUsuario, errorMsg);
	    hayVacios = true;
	}

	if (!valPassword) {
		mostrarErrorEnCampo(inputPassword, errorMsg);
	    hayVacios = true;
	}

	return hayVacios;
}


/**
* Valida si la contraseña introducida cumple con el formato esperado
* @return true si lo cumple
* 		  false si no lo cumple
*/
function esCorrectoElFormatoDeLaPassword(valPassword, inputPassword) {
	// Las contraseñas de "usuarios.json":
	// Empiezan por 4 números: \d{4} (o [0-9]{4})
	// El siguiente caracter es una letra mayúscula: [A-Z]
	// Termina con tres letras minúsculas: [a-z]{3}
	// 4 + 1 + 3 = 8 caracteres en total
	// La regex sería:
	const regexPassword = /^\d{4}[A-Z][a-z]{3}$/;
	let correctPassword = true;
	
	
	if(!regexPassword.test(valPassword)) {
		const errorMsg = 'Formato de contraseña incorrecto';
		mostrarErrorEnCampo(inputPassword, errorMsg);
		
		correctPassword = false;
	}
	
	return correctPassword;
}

/**
 * Muestra el mensaje "Completa este campo" si al pulsar "Entrar" hay algún campo vacío
 * Muestra el mensaje "Formato de contraseña incorrecto" si al pulsar "Entrar" la contraseña no tiene el formato esperado
 * 
 * Se activa el estilo input-error para mostrar los bordes de color naranja.
 */
function mostrarErrorEnCampo(inputElement, errorMsg) {
    inputElement.classList.add('input-error');

    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = errorMsg;

    inputElement.parentElement.appendChild(tooltip);
	
	// Ocultar mensaje y quitar borde de error tras 3 segundos
	setTimeout(() => {
	    tooltip.remove();
	    inputElement.classList.remove('input-error');
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