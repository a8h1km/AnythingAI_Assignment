// src/config/database.js
const { Sequelize } = require('sequelize');

// Switching to SQLite for easiest setup. 
// If you use Postgres later, change 'dialect' to 'postgres'
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false // Clean console output
});

module.exports = sequelize;