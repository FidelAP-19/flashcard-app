import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

//Decks
export const getMyDecks = () =>
  axios.get(`${API_URL}/decks/mine`, { headers: getAuthHeaders() });

export const createDeck = (data) =>
  axios.post(`${API_URL}/decks`, data, { headers: getAuthHeaders() });

export const deleteDeck = (id) =>
  axios.delete(`${API_URL}/decks/${id}`, { headers: getAuthHeaders() });

//Cards
export const getCardsByDeck = (deckId) =>
  axios.get(`${API_URL}/cards/deck/${deckId}`, { headers: getAuthHeaders() });

export const createCard = (deckId, data) =>
  axios.post(`${API_URL}/cards/deck/${deckId}`, data, { headers: getAuthHeaders() });

export const deleteCard = (id) =>
  axios.delete(`${API_URL}/cards/${id}`, { headers: getAuthHeaders() });

//Explore
export const getPublicDecks = () =>
  axios.get(`${API_URL}/decks/public`, { headers: getAuthHeaders() });

export const saveDeck = (deckId) =>
  axios.post(`${API_URL}/saved-decks/${deckId}`, { deck_id: deckId }, { headers: getAuthHeaders() });

//Study Sessions
export const logSession = (data) =>
  axios.post(`${API_URL}/sessions`, data, { headers: getAuthHeaders() });

//Analytics
export const getStreak = () =>
  axios.get(`${API_URL}/sessions/analytics/streak`, { headers: getAuthHeaders() });

export const getMostStudied = () =>
  axios.get(`${API_URL}/sessions/analytics/most-studied`, { headers: getAuthHeaders() });

export const getAverageScore = () =>
  axios.get(`${API_URL}/sessions/analytics/average-score`, { headers: getAuthHeaders() });


