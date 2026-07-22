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

export async function buscarProducto(codigo) {
  return apiRequest(`/api/productos/${encodeURIComponent(codigo)}`);
}
