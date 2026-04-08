const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/database')

class Deck extends Model {}

    Deck.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        title: { type: DataTypes.STRING, allowNull: false},
        description: { type: DataTypes.TEXT},
        is_public: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        
    }, {
        sequelize,
        tableName: 'decks',
        timestamps: true,
        underscored: true,
    });

    module.exports = Deck;
