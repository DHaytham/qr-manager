import axios from 'axios';

const TOKEN_KEY = 'qr-manager-token';

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Storage unavailable (e.g. private mode): the user just has to log in again.
  }
}

const api = axios.create({
  // Empty = same server that serves the page (production, and the dev proxy locally).
  baseURL: `${process.env.REACT_APP_API_BASE_URL || ''}/api`,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLogin = error.config && error.config.url === '/login';
    if (error.response && error.response.status === 401 && !isLogin) {
      setToken(null);
      window.location.assign('/login');
    }
    return Promise.reject(error);
  }
);

// Turns an axios error into a message to show the user.
export function errorMessage(error, fallback = 'Something went wrong. Please try again.') {
  return (error && error.response && error.response.data && error.response.data.message) || fallback;
}

export default api;
