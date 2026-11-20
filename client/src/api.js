const STORAGE_KEY = 'alzikrayat_user';

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}
export const storeUser = (user) => localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
export const clearStoredUser = () => localStorage.removeItem(STORAGE_KEY);

export async function api(path, { method = 'GET', body, isForm = false } = {}) {
  const headers = {};
  const user = getStoredUser();
  if (user) headers['x-user-id'] = user._id;
  if (body && !isForm) headers['Content-Type'] = 'application/json';

  const res = await fetch(`/api${path}`, {
    method,
    headers,
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.errors?.join(' • ') || data.message || 'Request failed');
  return data;
}

export const fullName = (u) => (u ? `${u.firstName} ${u.lastName}` : 'Unknown');
export const formatDate = (d) => new Date(d).toLocaleString();
