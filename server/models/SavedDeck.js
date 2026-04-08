const { Model, DataTypes} = require('sequelize');
const sequelize = require('../config/database')

class SavedDeck extends Model{}

    SavedDeck.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    }, {
        sequelize,
        tableName: 'saved_decks',
        timestamps: true,
        underscored: true,
    })

    module.exports = SavedDeck
