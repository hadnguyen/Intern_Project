const { Sequelize } = require('sequelize');

require('dotenv').config();
module.exports = new Sequelize(
  'VMO_Project',
  'postgres',
  process.env.DB_PASSWORD,
  {
    host: 'localhost',
    dialect: 'postgres',
  }
);
