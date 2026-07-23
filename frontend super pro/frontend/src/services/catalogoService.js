import { apiRequest } from './Api';

export async function listarCategorias() {
  return apiRequest('/api/categorias');
}

export async function crearCategoria(categoria) {
  return apiRequest('/api/categorias', {
    method: 'POST',
    body: JSON.stringify(categoria),
  });
}

export async function eliminarCategoria(id) {
  return apiRequest(`/api/categorias/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export async function listarProveedores() {
  return apiRequest('/api/proveedores');
}

export async function crearProveedor(proveedor) {
  return apiRequest('/api/proveedores', {
    method: 'POST',
    body: JSON.stringify(proveedor),
  });
}

export async function eliminarProveedor(id) {
  return apiRequest(`/api/proveedores/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}
