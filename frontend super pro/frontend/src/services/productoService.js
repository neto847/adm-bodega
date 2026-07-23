import { apiRequest } from './Api';

export async function listarProductos() {
  return apiRequest('/api/productos');
}

export async function crearProducto(producto) {
  return apiRequest('/api/productos', {
    method: 'POST',
    body: JSON.stringify(producto),
  });
}

export async function actualizarProducto(id, producto) {
  return apiRequest(`/api/productos/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(producto),
  });
}

export async function eliminarProducto(id) {
  return apiRequest(`/api/productos/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export async function buscarProducto(codigo) {
  return apiRequest(`/api/productos/${encodeURIComponent(codigo)}`);
}
