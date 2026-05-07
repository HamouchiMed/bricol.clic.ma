import AsyncStorage from '@react-native-async-storage/async-storage';

// Force use of local IP
const API_URL = 'http://192.168.1.71:3001/api';

const fetchWithTimeout = async (url, options = {}, timeout = 10000, retries = 2) => {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(id);
      return response;
    } catch (err) {
      if (i === retries - 1) throw err;
      console.warn(`Retry ${i + 1} for ${url}`);
    }
  }
};

const api = {
  login: async (credentials) => {
    const response = await fetchWithTimeout(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Login failed');
    return data;
  },

  signup: async (userData) => {
    const response = await fetchWithTimeout(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Signup failed');
    return data;
  },

  getPrestataires: async () => {
    const response = await fetchWithTimeout(`${API_URL}/prestataires`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch prestataires');
    return data;
  },

  getCategories: async () => {
    const response = await fetchWithTimeout(`${API_URL}/categories`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch categories');
    return data;
  },

  getPrestatairesByMetier: async (metier) => {
    const response = await fetchWithTimeout(`${API_URL}/prestataires/metier/${encodeURIComponent(metier)}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch prestataires by metier');
    return data;
  },

  search: async (query) => {
    const response = await fetchWithTimeout(`${API_URL}/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Search failed');
    return data;
  },

  getTransactions: async () => {
    const response = await fetchWithTimeout(`${API_URL}/transactions`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch transactions');
    return data;
  },

  getProviderProfile: async (userId) => {
    const response = await fetchWithTimeout(`${API_URL}/providers/${userId}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch provider profile');
    return data;
  },

  getClientProfile: async (token) => {
    const response = await fetchWithTimeout(`${API_URL}/clients/me?token=${token}`);
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to fetch client profile');
    return result;
  },

  updateClientProfile: async (token, data) => {
    const response = await fetchWithTimeout(`${API_URL}/clients/me?token=${token}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to update client profile');
    return result;
  },

  getProviderMissions: async (providerId) => {
    const response = await fetchWithTimeout(`${API_URL}/providers/${providerId}/missions`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch missions');
    return data;
  },

  getClientMissions: async (token) => {
    const response = await fetchWithTimeout(`${API_URL}/clients/me/missions?token=${token}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch client missions');
    return data;
  },

  updateMissionStatus: async (missionId, status) => {
    const response = await fetchWithTimeout(`${API_URL}/missions/${missionId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to update mission status');
    return data;
  },

  createMission: async (clientId, providerId, title) => {
    const response = await fetchWithTimeout(`${API_URL}/missions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, providerId, title }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to create mission');
    return data;
  },

  saveToken: async (token) => {
    await AsyncStorage.setItem('userToken', token);
  },

  getToken: async () => {
    return await AsyncStorage.getItem('userToken');
  },

  logout: async () => {
    await AsyncStorage.removeItem('userToken');
  }
};

export default api;
