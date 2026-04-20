const express = require('express');
const router = express.Router();
const studySessionService = require('../services/studySessionService');
const authenticate = require('../middleware/auth');

router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const sessions = await studySessionService.getMySessions(req.user.id);
    res.json(sessions);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const session = await studySessionService.logSession(req.body, req.user.id);
    res.status(201).json(session);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.get('/analytics/cards-per-day', async (req, res) => {
    try {
        const data = await studySessionService.getCardsReviewedPerDay(req.user.id);
        res.json(data);
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
});

router.get('/analytics/average-score', async (req, res) => {
    try {
        const data = await studySessionService.getAverageScorePerDeck(req.user.id);
        res.json(data)
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message});
    }
});

router.get('/analytics/most-studied', async (req, res) => {
    try {
      const data = await studySessionService.getMostStudiedDecks(req.user.id);
      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  });
  
  router.get('/analytics/streak', async (req, res) => {
    try {
      const data = await studySessionService.getStudyStreak(req.user.id);
      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  });

module.exports = router;