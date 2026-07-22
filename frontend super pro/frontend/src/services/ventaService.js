import { apiRequest } from './Api';

export async function registrarVenta(venta) {
  return apiRequest('/api/ventas', {
    method: 'POST',
    body: JSON.stringify(venta),
  });
}

export async function obtenerHistorialVentas() {
  return apiRequest('/api/ventas');
}
