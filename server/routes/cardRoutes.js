const express = require('express');
const router = express.Router();
const cardService = require('../services/cardService');
const authenticate = require('../middleware/auth');

router.use(authenticate);

router.get('/deck/:deckId', async (req,res) => {
    try{
        const cards = await cardService.getCardsByDeck(req.params.deckId);
        res.json(cards)
    }catch(err){
        res.status(err.status || 500).json({ error: err.message });
    }
});

router.get('/:id', async (req,res) => {
    try {
        const card = await cardService.getCardById(req.params.id);
        res.json(card);
    } catch (err) {
        res.status(err.status || 500).json({error: err.message})
    }
});

router.post('/deck/:deckId', async (req,res) => {
    try {
        const card = await cardService.createCard(req.params.deckId, req.body, req.user.id);
        res.status(201).json(card);
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message})
    }
});

router.put('/:id', async(req,res) => {
    try {
        const card = await cardService.updateCard(req.params.id, req.body, req.user.id);
        res.json(card);
    } catch (err) {
        res.status(err.status || 500).json({error: err.message});
    }
});

router.delete('/:id', async (req,res) => {
    try {
        const result = await cardService.deleteCard(req.params.id, req.user.id);
        res.json(result)
    } catch (err) {
        res.status(err.message || 500).json({error: err.message});
    }
});

module.exports = router;