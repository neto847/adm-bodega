const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json().catch(() => null) : await response.text();

  if (!response.ok) {
    const message = typeof data === 'string' ? data : data?.message || 'Error en la solicitud';
    throw new Error(message);
  }

  return data;
}
