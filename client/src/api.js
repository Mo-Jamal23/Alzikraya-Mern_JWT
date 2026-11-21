import axios from 'axios';

const USER_KEY = 'alzikrayat_user';
const TOKEN_KEY = 'alzikrayat_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

export function storeSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

const client = axios.create({ baseURL: '/api' });

client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = Bearer ${token};
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && getToken()) {
      clearSession();
      window.dispatchEvent(new Event('auth:expired'));
    }
    return Promise.reject(error);
  }
);

export async function api(path, { method = 'GET', body } = {}) {
  try {
    const res = await client({ url: path, method, data: body });
    return res.data;
  } catch (err) {
    const data = err.response?.data;
    throw new Error(
      data?.errors?.join(' • ')  data?.message  'Request failed'
    );
  }
}

export const fullName = (u) =>
  (u ? ${u.firstName} ${u.lastName} : 'Unknown');

export const formatDate = (d) => new Date(d).toLocaleString();
