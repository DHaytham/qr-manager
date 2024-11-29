const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  id: { type: String, required: true },
  placeholder_url: { type: String, required: true },
  is_sold: { type: Boolean, default: false },
  customer_url: { type: String, default: null },
  qr_code: { type: String, required: true },
});

module.exports = mongoose.models.Card || mongoose.model('Card', cardSchema);