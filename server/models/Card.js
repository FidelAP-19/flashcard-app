const { Model, DataTypes} = require('sequelize');
const sequelize = require('../config/database')

class Card extends Model {}

    Card.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        front: { type: DataTypes.TEXT, allowNull: false },
        back: { type: DataTypes.TEXT, allowNull: false },
    },{
        sequelize,
        tableName: 'cards',
        timestamps: true,
        underscored: true,
    });

    module.exports = Card;
