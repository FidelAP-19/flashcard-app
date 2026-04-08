const express = require('express');
const sequelize = require('./config/database');
require('dotenv').config();
require('./models');

const app = express()
const PORT  = process.env.PORT || 3001;


app.use(express.json());

app.get('/', (req,res) => {
    res.json({message : 'Flashcard API runing. ' });
});

sequelize.authenticate()
    .then(() => {
        console.log('Database connected.');
        return sequelize.sync({alter: true});
    })
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    })
    .catch(err => console.error('DB connection failed:', err));