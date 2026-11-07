const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Card = sequelize.define(
  'Card',
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    // The URL encoded in the QR code (points back to this app).
    placeholder_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_sold: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // Where scanning the QR code sends people. Empty until the card is assigned.
    customer_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // QR code image as a data: URL.
    qr_code: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    hits: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  { timestamps: true }
);

module.exports = Card;
