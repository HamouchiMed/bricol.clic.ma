// API_BASE_URL - Update this if backend runs on different machine
const API_BASE_URL = 'http://localhost:3000/api';

// Check API connectivity
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/api/health`);
    return response.ok;
  } catch (error) {
    console.warn('Backend not available:', error.message);
    return false;
  }
};

// Get all prestataires
export const getPrestataires = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/prestataires`);
    if (!response.ok) throw new Error('Failed to fetch prestataires');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching prestataires:', error);
    throw error;
  }
};

// Get prestataires by service type (métier)
export const getPrestairesByMetier = async (metier) => {
  try {
    const response = await fetch(`${API_BASE_URL}/prestataires/metier/${encodeURIComponent(metier)}`);
    if (!response.ok) throw new Error('Failed to fetch prestataires');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching prestataires by metier:', error);
    throw error;
  }
};

// Get single prestataire
export const getPrestataire = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/prestataires/${id}`);
    if (!response.ok) throw new Error('Prestataire not found');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching prestataire:', error);
    throw error;
  }
};

// Search prestataires
export const searchPrestataires = async (query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Search failed');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching prestataires:', error);
    throw error;
  }
};

// Add new prestataire (for admin/registration)
export const addPrestataire = async (nom, metier, telephone) => {
  try {
    const response = await fetch(`${API_BASE_URL}/prestataires`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nom, metier, telephone }),
    });
    if (!response.ok) throw new Error('Failed to add prestataire');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding prestataire:', error);
    throw error;
  }
};
