import { cargarJSON } from './services/cargar-datos.js';
import { iniciarLogin } from './services/login.js';
import { mostrarInstrucciones } from './services/instrucciones.js';
import { mostrarJuego } from './services/juego.js';
import { mostrarResultados } from './services/resultados.js';

// Si la página actual es la de login (index.html), cargamos los datos en el localStorage.
// Obtenemos la ruta actual
const rutaActual = window.location.pathname;

// Comprobamos si incluye el nombre del archivo
if (rutaActual.includes('index.html') || rutaActual === '/') {
	// Limpio el sessionStorage
	sessionStorage.clear();
	
	// Almacena la ruta del fichero '.json' con los datos
	const JSON_PATH = './data/json/usuarios.json';
	
	// Variable para almacenar los datos del '.json'
	let datosJSON = [];
	
	// Llamada a la función que carga los datos
	cargarJSON(JSON_PATH , datos => {
	    datosJSON = datos;
		
		for (const dato of datosJSON) {
			// 1. Guardo cada registro en el localStorage usando el ID como clave y el objeto en JSON como valor
			localStorage.setItem(dato.id, JSON.stringify(dato));
			console.log("Registro guardado en el localStorage: ", JSON.parse(localStorage.getItem(dato.id)));
		}
	});
	
	iniciarLogin();
} else {
	// Llamada a la función iniciarLogin, que controlará los eventos del login
	if(sessionStorage.getItem('usuarioActivo') != null){
		switch (true) {
		    case rutaActual.includes('instrucciones.html'):
		        mostrarInstrucciones();
		        break;
		    case rutaActual.includes('juego.html'):
		        mostrarJuego();
		        break;
		    case rutaActual.includes('resultados.html'):
		        mostrarResultados();
		        break;
		}
		
	} else {
		// Error: no hay usuario con sesión iniciada => se redirige al login
		window.location.href = rutaActual.includes('/html/') ? '../index.html' : 'index.html';
	}
}