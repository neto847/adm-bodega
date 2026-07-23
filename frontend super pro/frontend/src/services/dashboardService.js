import { apiRequest } from './Api';

export async function obtenerDashboard() {
  return apiRequest('/api/dashboard');
}

export async function obtenerDashboardDueno() {
  return apiRequest('/api/dashboard/dueno');
}
