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

const getCardsReviewedPerDay = async (userId) => {
  const sessions = await studySessionRepository.findByUserId(userId);

  const perDay = sessions.reduce((acc, session) => {
      const day = new Date(session.studied_at).toISOString().split('T')[0];
      acc[day] = (acc[day] || 0) + session.cards_reviewed;
      return acc;
  }, {});

  return Object.entries(perDay)
  .map(([date, cards_reviewed]) => ({ date, cards_reviewed}))
  .sort((a, b) => new Date(a.date) - new Date(b.date));

};

const getAverageScorePerDeck = async (userId) => {
  const sessions = await studySessionRepository.findByUserId(userId);

  const deckMap = sessions.reduce((acc, session) => {
    const deckId = session.deck_id;
    const title = session.Deck?.title || 'Unknown';
    if (!acc[deckId]) acc[deckId] = { title, total: 0, count: 0 };
    if (session.score !== null) {
      acc[deckId].total += session.score;
      acc[deckId].count += 1;
    }
    return acc;
  }, {});

  return Object.entries(deckMap).map(([deck_id, data]) => ({
    deck_id: parseInt(deck_id),
    title: data.title,
    average_score: data.count > 0 ? parseFloat((data.total / data.count).toFixed(2)) : null,
    sessions: data.count,
  }));
};

const getMostStudiedDecks = async (userId) => {
  const sessions = await studySessionRepository.findByUserId(userId);

  const counts = sessions.reduce((acc, session) => {
    const deckId = session.deck_id;
    const title = session.Deck?.title || 'Unknown';
    if (!acc[deckId]) acc[deckId] = { title, count: 0 };
    acc[deckId].count += 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([deck_id, data]) => ({ deck_id: parseInt(deck_id), title: data.title, sessions: data.count }))
    .sort((a, b) => b.sessions - a.sessions);
};

const getStudyStreak = async (userId) => {
  const sessions = await studySessionRepository.findByUserId(userId);

  const days = [...new Set(
    sessions.map(s => new Date(s.studied_at).toISOString().split('T')[0])
  )].sort((a, b) => new Date(b) - new Date(a));

  if (days.length === 0) return { streak: 0 };

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (days[0] !== today && days[0] !== yesterday) return { streak: 0 };

  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1]);
    const curr = new Date(days[i]);
    const diffDays = (prev - curr) / 86400000;
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return { streak };
};

module.exports = {
  getMySessions,
  logSession,
  getCardsReviewedPerDay,
  getAverageScorePerDeck,
  getMostStudiedDecks,
  getStudyStreak,
};