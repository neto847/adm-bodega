import { apiRequest } from './Api';

export async function registrarCompra(compra) {
  return apiRequest('/api/compras', {
    method: 'POST',
    body: JSON.stringify(compra),
  });
}
