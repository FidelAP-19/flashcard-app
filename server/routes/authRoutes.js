const express = require('express');
const router = express.Router();
const authService = require('../services/authService');

//POST Register
router.post('/register', async (req, res) => {
    try{
        const result = await authService.register(req.body);
        res.status(201).json(result);
    }catch(err){
        res.status(err.status || 500).json({error: err.message});
    }
});

//POST Login
router.post('/login', async (req, res) => {
    try{
        const result = await authService.login(req.body);
        res.json(result);
    }catch(err){
        res.status(err.status || 500).json({error: err.message});
    }
})

module.exports = router;
