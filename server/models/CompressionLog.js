const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CompressionLog = sequelize.define(
  'CompressionLog',
  {
    filename: {
      type: DataTypes.STRING,
      allowNull: false
    },
    original_size: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    compressed_size: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    compression_ratio: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  },
  {
    tableName: 'compression_logs',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  }
);

module.exports = CompressionLog;
