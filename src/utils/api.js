const API_BASE_URL = 'http://localhost:5000/api/v1';

let logoutCallback = null;

export const setLogoutCallback = (cb) => {
  logoutCallback = cb;
};

const getHeaders = (isMultipart = false) => {
  const headers = {};
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  
  const token = localStorage.getItem('sirat_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

const handleResponse = async (response) => {
  if (response.status === 401) {
    localStorage.removeItem('sirat_token');
    localStorage.removeItem('sirat_user');
    if (logoutCallback) {
      logoutCallback();
    }
  }

  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    throw new Error(data.message || 'Terjadi kesalahan pada server');
  }
  
  return data;
};

export const api = {
  get: async (endpoint) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  post: async (endpoint, body, isMultipart = false) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(isMultipart),
      body: isMultipart ? body : JSON.stringify(body),
    });
    return handleResponse(res);
  },

  put: async (endpoint, body) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  patch: async (endpoint, body) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  delete: async (endpoint) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};
