import { apiRequest } from './Api';

export async function obtenerDashboard() {
  return apiRequest('/api/dashboard');
}
