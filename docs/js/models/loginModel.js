/**
 * Busca coincidencias entre las credenciales introducidas por el usuario y
 * los usuarios almacenados en el localStorage.
 * Si encuentra el usuario, lo guarda en el SessionStorage.
 * 
 * @return true si hay coincidencias
 * 		   false si no las hay
 */
export function elUsuarioExiste(valUsuario, valPassword){
	let usuarioValido = false;

	// Se recorre el localStorage
	for (let i = 0; i < localStorage.length; i++) {
        const usuarioActual = JSON.parse(localStorage.getItem(localStorage.key(i)));
		
        // Comprobar si coinciden usuario y contraseña
        if (usuarioActual && usuarioActual.usuario ===
			valUsuario && usuarioActual.contraseña === valPassword) {
            			
			usuarioValido = true;            
			
			// Se guarda el usuario (solo el nombre) con en el SessionStorage
            sessionStorage.setItem('usuarioActivo', JSON.stringify(usuarioActual.nombre));
            break;
        }
	}
	
	return usuarioValido;
}