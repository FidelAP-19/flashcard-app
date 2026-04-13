const studySessionRepository = require('../repositories/studySessionRepository');
const deckRepository = require('../repositories/deckRepository');

const getMySessions = async (userId) => {
  return studySessionRepository.findByUserId(userId);
};

const logSession = async (data, userId) => {
  const { deck_id, cards_reviewed, score } = data;

  if (!deck_id || cards_reviewed === undefined) {
    const error = new Error('deck_id and cards_reviewed are required');
    error.status = 400;
    throw error;
  }

  const deck = await deckRepository.findById(deck_id);
  if (!deck) {
    const error = new Error('Deck not found');
    error.status = 404;
    throw error;
  }

  return studySessionRepository.create({
    user_id: userId,
    deck_id,
    cards_reviewed,
    score,
    studied_at: new Date(),
  });
};

module.exports = { getMySessions, logSession };