import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5001/api`;

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

// ── Destinations (placeholder for future backend) ──
export const destinationsAPI = {
  getAll:   (params) => api.get('/destinations', { params }),
  getById:  (id)     => api.get(`/destinations/${id}`),
  search:   (query)  => api.get('/destinations/search', { params: { q: query } }),
};

// ── Trips ──────────────────────────────────────
export const tripsAPI = {
  getAll:   ()       => api.get('/trips'),
  getById:  (id)     => api.get(`/trips/${id}`),
  create:   (data)   => api.post('/trips', data),
  update:   (id, d)  => api.put(`/trips/${id}`, d),
  delete:   (id)     => api.delete(`/trips/${id}`),
};

// ── Reviews ────────────────────────────────────
export const reviewsAPI = {
  getAll:           ()      => api.get('/reviews'),
  getByDestination: (destId) => api.get(`/reviews/destination/${destId}`),
  create:  (data)  => api.post('/reviews', data),
  delete:  (id)    => api.delete(`/reviews/${id}`),
};

// ── Wishlist ───────────────────────────────────
export const wishlistAPI = {
  getAll:  ()      => api.get('/wishlist'),
  add:     (destId) => api.post('/wishlist', { destinationId: destId }),
  remove:  (destId) => api.delete(`/wishlist/${destId}`),
};

export default api;
