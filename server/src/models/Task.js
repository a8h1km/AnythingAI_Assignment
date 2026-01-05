// src/models/Task.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed'),
        defaultValue: 'pending'
    },
    // We will link this to User in app.js
});

module.exports = Task;