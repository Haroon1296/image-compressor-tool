const sequelize = require('../config/database');
const CompressionLog = require('./CompressionLog');

const db = {
  sequelize,
  CompressionLog
};

module.exports = db;
