const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Card = sequelize.define('Card', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  placeholder_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_sold: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  customer_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  qr_code: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = Card;