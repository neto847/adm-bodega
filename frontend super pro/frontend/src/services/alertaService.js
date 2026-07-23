import { apiRequest } from './Api';

export async function obtenerAlertasCaducidad() {
  return apiRequest('/api/alertas/caducidad');
}
