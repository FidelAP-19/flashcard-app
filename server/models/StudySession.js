const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database')

class StudySession extends Model {}

    StudySession.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        cards_reviewed: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
        score: { type: DataTypes.FLOAT},
        studied_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW},
    }, {
        sequelize,
        tableName: 'study_sessions',
        timestamps: true,
        underscored: false,
    });

    module.exports = StudySession;
