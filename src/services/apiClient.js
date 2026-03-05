const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_BASE = `${BASE_URL}/api`;

export async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!response.ok) {
    const text = await response.text().catch(() => response.statusText);
    throw new Error(`API error ${response.status}: ${text}`);
  }
  return response;
}

export function streamSearch(query, collectionName = 'portfolio-docs', topK = 5) {
  const params = new URLSearchParams({ query, collectionName, topK });
  return fetch(`${API_BASE}/search/stream?${params}`, {
    headers: { Accept: 'text/event-stream' },
  });
}

/** Quick liveness check — resolves true if the API is reachable, false otherwise */
export async function checkHealth(timeoutMs = 4000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: controller.signal });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}
