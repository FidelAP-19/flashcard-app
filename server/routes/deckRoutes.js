const express = require('express');
const router = express.Router();
const deckService = require('../services/deckService');
const authenticate = require('../middleware/auth');

//Public - no auth 
router.get('/public', async (req, res) => {
    try{
        const decks = await deckService.getPublicDecks();
        res.json(decks);
    }catch(err) {
        res.status(err.status || 500).json({error: err.message});
    }
});

//All routes require valid token
router.use(authenticate);

router.get('/', async (req, res) => {
    try {
        const decks = await deckService.getAllDecks();
        res.json(decks);
    }catch(err){
        res.status(err.status || 500).json({ error: err.message });
    }
});

router.get('/mine', async (req, res) => {
    try{
        const decks = await deckService.getMyDecks(req.user.id);
        res.json(decks);
    }catch(err){
        res.status(err.status || 500).json({ error: err.message })
    }
});

router.get('/:id', async (req,res) => {
    try{
        const deck = await deckService.getDeckById(req.params.id);
        res.json(deck)
    }catch(err){
        res.status(err.status || 500).json({error: err.message});
    }
});

router.post('/', async (req, res) => {
    try{
        const deck = await deckService.createDeck(req.body, req.user.id);
        res.status(201).json(deck);
    }catch(err){
        res.status(err.status || 500).json({error: err.message});
    }
});

router.put('/:id', async (req, res) => {
    try{
        const deck = await deckService.updateDeck(req.params.id, req.body, req.user.id);
        res.json(deck)
    }catch(err){
        res.status(err.status || 500).json({error: err.message});
    }
});

router.delete('/:id', async (req, res) => {
    try{
        const result = await deckService.deleteDeck(req.params.id, req.user.id);
        res.json(result)
    }catch(err){
        res.status(err.status || 500).json({error: err.message});
    }
});

module.exports = router;