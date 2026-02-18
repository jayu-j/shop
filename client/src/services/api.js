const API_URL = process.env.REACT_APP_API_URL || '/api';

// Helper to get auth headers
const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
};

// Auth API
export const authAPI = {
  register: async (userData) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  login: async (credentials) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  getMe: async () => {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  updateProfile: async (userData) => {
    const res = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  addToWishlist: async (productId) => {
    const res = await fetch(`${API_URL}/auth/wishlist/${productId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  removeFromWishlist: async (productId) => {
    const res = await fetch(`${API_URL}/auth/wishlist/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },
};

// Products API
export const productsAPI = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/products${query ? `?${query}` : ''}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  getById: async (id) => {
    const res = await fetch(`${API_URL}/products/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  create: async (productData) => {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(productData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  update: async (id, productData) => {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(productData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  delete: async (id) => {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },
};

// Cart API
export const cartAPI = {
  get: async () => {
    const res = await fetch(`${API_URL}/cart`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  addItem: async (productId, quantity = 1) => {
    const res = await fetch(`${API_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ productId, quantity }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  updateItem: async (productId, quantity) => {
    const res = await fetch(`${API_URL}/cart/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ quantity }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  removeItem: async (productId) => {
    const res = await fetch(`${API_URL}/cart/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  clear: async () => {
    const res = await fetch(`${API_URL}/cart`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },
};

// Orders API
export const ordersAPI = {
  create: async (orderData) => {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(orderData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  getAll: async () => {
    const res = await fetch(`${API_URL}/orders`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  getById: async (id) => {
    const res = await fetch(`${API_URL}/orders/${id}`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  pay: async (id) => {
    const res = await fetch(`${API_URL}/orders/${id}/pay`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  getAllAdmin: async () => {
    const res = await fetch(`${API_URL}/orders/all`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  updateStatus: async (id, status) => {
    const res = await fetch(`${API_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },
};

// Payments API
export const paymentsAPI = {
  initiate: async (paymentData) => {
    const res = await fetch(`${API_URL}/payments/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(paymentData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  verify: async (verifyData) => {
    const res = await fetch(`${API_URL}/payments/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(verifyData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  getByOrder: async (orderId) => {
    const res = await fetch(`${API_URL}/payments/${orderId}`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  getAll: async () => {
    const res = await fetch(`${API_URL}/payments`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },
};

// Recommendations API
export const recommendationsAPI = {
  getPersonalized: async (limit = 8) => {
    const res = await fetch(`${API_URL}/recommendations/personalized?limit=${limit}`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  getSimilar: async (productId, limit = 6) => {
    const res = await fetch(`${API_URL}/recommendations/similar/${productId}?limit=${limit}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  getFrequentlyBought: async (productId, limit = 4) => {
    const res = await fetch(`${API_URL}/recommendations/frequently-bought/${productId}?limit=${limit}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  getTrending: async (limit = 8) => {
    const res = await fetch(`${API_URL}/recommendations/trending?limit=${limit}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  getForYou: async (limit = 8) => {
    const res = await fetch(`${API_URL}/recommendations/for-you?limit=${limit}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  trackActivity: async (productId, activityType) => {
    const res = await fetch(`${API_URL}/recommendations/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ productId, activityType }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },
};
