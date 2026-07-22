import { apiRequest } from './Api';

export async function login(usuario, password) {
  return apiRequest('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email: usuario, usuario, password }),
  });
}

export function mapUsuarioParaUI(usuario) {
  const idRol = usuario?.idRol ?? usuario?.rolId ?? usuario?.id_rol ?? null;
  const rol = idRol === 1 ? 'Dueño' : 'Encargado';

  return {
    idUsuario: usuario?.idUsuario ?? usuario?.id ?? usuario?.id_usuario ?? null,
    nombre: usuario?.nombre ?? usuario?.name ?? 'Usuario',
    email: usuario?.email ?? usuario?.correo ?? '',
    rol,
  };
}
