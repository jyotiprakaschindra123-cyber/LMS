const API_BASE = import.meta.env.VITE_API_URL || '/api';
const BLOCK_NOTICE_KEY = 'utkal_block_notice';

export function getToken() {
  return localStorage.getItem('utkal_token');
}

export function setToken(token) {
  if (token) localStorage.setItem('utkal_token', token);
  else localStorage.removeItem('utkal_token');
}

export function getBlockNotice() {
  return localStorage.getItem(BLOCK_NOTICE_KEY) || '';
}

export function setBlockNotice(message) {
  if (message) localStorage.setItem(BLOCK_NOTICE_KEY, message);
  else localStorage.removeItem(BLOCK_NOTICE_KEY);
}

export async function api(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    body: options.body && typeof options.body !== 'string' ? JSON.stringify(options.body) : options.body
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 423) {
      setBlockNotice(data.message || 'This panel has been blocked by the admin.');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('utkal:panel-blocked', { detail: data }));
      }
    }
    const error = new Error(data.message || 'Request failed.');
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

export const money = (value = 0) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

export const dateText = (value) =>
  value
    ? new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(value))
    : '-';
