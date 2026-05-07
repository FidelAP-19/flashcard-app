import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export const register = (data) =>
  API.post('/auth/register', data);

export const login = (data) =>
  API.post('/auth/login', data);

// Decks
export const getMyDecks = () =>
  API.get('/decks/mine', { headers: getAuthHeaders() });

export const createDeck = (data) =>
  API.post('/decks', data, { headers: getAuthHeaders() });

export const deleteDeck = (id) =>
  API.delete(`/decks/${id}`, { headers: getAuthHeaders() });

// Cards
export const getCardsByDeck = (deckId) =>
  API.get(`/cards/deck/${deckId}`, { headers: getAuthHeaders() });

export const createCard = (deckId, data) =>
  API.post(`/cards/deck/${deckId}`, data, { headers: getAuthHeaders() });

export const deleteCard = (id) =>
  API.delete(`/cards/${id}`, { headers: getAuthHeaders() });

// Explore
export const getPublicDecks = () =>
  API.get('/decks/public', { headers: getAuthHeaders() });

export const saveDeck = (deckId) =>
  API.post(`/saved-decks/${deckId}`, { deck_id: deckId }, { headers: getAuthHeaders() });

// Study Sessions
export const logSession = (data) =>
  API.post('/sessions', data, { headers: getAuthHeaders() });

// Analytics
export const getStreak = () =>
  API.get('/sessions/analytics/streak', { headers: getAuthHeaders() });

export const getMostStudied = () =>
  API.get('/sessions/analytics/most-studied', { headers: getAuthHeaders() });

export const getAverageScore = () =>
  API.get('/sessions/analytics/average-score', { headers: getAuthHeaders() });