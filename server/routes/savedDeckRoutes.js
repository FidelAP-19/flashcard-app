const express = require('express');
const router = express.Router();
const savedDeckService = require('../services/savedDeckService');
const authenticate = require('../middleware/auth');

router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const saved = await savedDeckService.getSavedDecks(req.user.id);
    res.json(saved);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.post('/:deckId', async (req, res) => {
  try {
    const saved = await savedDeckService.saveDeck(req.user.id, req.params.deckId);
    res.status(201).json(saved);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.delete('/:deckId', async (req, res) => {
  try {
    const result = await savedDeckService.unsaveDeck(req.user.id, req.params.deckId);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

module.exports = router;