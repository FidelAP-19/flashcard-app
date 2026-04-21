const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
require('dotenv').config();
require('./models');

const app = express()
const PORT = process.env.PORT || 3001;


//Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

//Import routes
const authRoutes = require('./routes/authRoutes');
const deckRoutes = require('./routes/deckRoutes');
const cardRoutes = require('./routes/cardRoutes');
const savedDeckRoutes = require('./routes/savedDeckRoutes');
const studySessionRoutes = require('./routes/studySessionRoutes');


//Health Check
app.get('/', (req, res) => {
    res.json({ message: 'Flashcard API runing. ' });
});


//Mount
app.use('/api/auth', authRoutes);
app.use('/api/decks', deckRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/saved-decks', savedDeckRoutes);
app.use('/api/sessions', studySessionRoutes);

// DB Connection
sequelize.authenticate()
    .then(() => {
        console.log('Database connected.');
        return sequelize.sync({ alter: true });
    })
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    })
    .catch(err => console.error('DB connection failed:', err));

    module.exports = app; 