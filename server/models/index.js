const User = require('./User');
const Deck = require('./Deck');
const Card = require('./Card');
const SavedDeck = require('./SavedDeck');
const StudySession = require('./StudySession');

//One-to-many
User.hasMany( Deck, {foreignKey: 'user_id', onDelete: 'CASCADE'});
Deck.belongsTo( User, { foreignKey: 'user_id'});

Deck.hasMany( Card, {foreignKey: 'deck_id', onDelete: 'CASCADE'});
Card.belongsTo( Deck, {foreignKey: 'deck_id', onDelete: 'CASCADE'});

User.hasMany( StudySession, {foreignKey: 'user_id', onDelete: ' CASCADE'});
StudySession.belongsTo( User, {foreignKey: 'user_id'});

Deck.hasMany( StudySession, { foreignKey: 'deck_id', onDelete: 'CASCADE'});
StudySession.belongsTo( Deck, { foreignKey: 'deck_id'});

// Many-to-many
User.belongsToMany( Deck, { through: SavedDeck, foreignKey: 'user_id', as: 'SavedDecks'});
Deck.belongsToMany( User, { through: SavedDeck, foreignKey: 'deck_id', as: 'SavedByUsers'});

module.exports = { User, Deck, Card, SavedDeck, StudySession };