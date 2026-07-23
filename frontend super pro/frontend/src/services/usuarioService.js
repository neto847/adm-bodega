import { apiRequest } from './Api';

export async function listarUsuarios() {
  return apiRequest('/api/usuarios');
}

export async function crearUsuario(usuario) {
  return apiRequest('/api/usuarios', {
    method: 'POST',
    body: JSON.stringify(usuario),
  });
}

export async function eliminarUsuario(id) {
  return apiRequest(`/api/usuarios/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}
