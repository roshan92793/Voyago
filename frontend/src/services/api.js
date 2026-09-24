import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL
  || `${window.location.protocol}//${window.location.hostname}:5001/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('voyago_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('voyago_token');
      localStorage.removeItem('voyago_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  profile:  ()     => api.get('/auth/profile'),
};

// ── Destinations ─────────────────────────────
export const destinationsAPI = {
  getAll:      (params) => api.get('/destinations', { params }),
  getById:     (id)     => api.get(`/destinations/${id}`),
  create:      (data)   => api.post('/destinations', data),
  update:      (id, data) => api.put(`/destinations/${id}`, data),
  delete:      (id)     => api.delete(`/destinations/${id}`),
  fetchImages: (id)     => api.get(`/destinations/${id}/images`),
  search:      (query)  => api.get('/destinations/search', { params: { q: query } }),
};

// ── Trips ──────────────────────────────────────
export const tripsAPI = {
  getAll:   ()       => api.get('/trip'),
  getById:  (id)     => api.get(`/trip/${id}`),
  create:   (data)   => api.post('/trip', data),
  update:   (id, d)  => api.put(`/trip/${id}`, d),
  delete:   (id)     => api.delete(`/trip/${id}`),
};

// ── Reviews ────────────────────────────────────
export const reviewsAPI = {
  getAll:           ()      => api.get('/reviews'),
  getByDestination: (destId) => api.get(`/reviews/destination/${destId}`),
  create:  (data)  => api.post('/reviews', data),
  update:  (id, data) => api.put(`/reviews/${id}`, data),
  delete:  (id)    => api.delete(`/reviews/${id}`),
};

// ── Wishlist ───────────────────────────────────
export const wishlistAPI = {
  getAll:  ()      => api.get('/wishlist'),
  add:     (destId) => api.post('/wishlist', { destinationId: destId }),
  remove:  (destId) => api.delete(`/wishlist/${destId}`),
};

export default api;
