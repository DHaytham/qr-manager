const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const Card = require('../models/Card');
const CONFIG = require('../client/config');

// Generate QR Code
router.post('/generate', async (req, res) => {
  try {
    const uniqueId = `card-${Date.now()}`;
    const placeholderUrl = `${CONFIG.API_BASE_URL}/api/r/${uniqueId}`;
    
    // Generate QR code
    const qrCode = await QRCode.toDataURL(placeholderUrl);

    const card = new Card({
      id: uniqueId,
      placeholder_url: placeholderUrl,
      qr_code: qrCode,
    });
    await card.save();
    res.status(201).json(card);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all cards
router.get('/cards', async (req, res) => {
  try {
    const cards = await Card.find().sort({ createdAt: -1 });
    res.json(cards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch card for update

router.get('/cards/:id', async (req, res) => {
  try {
    const card = await Card.findOne({ id: req.params.id });
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.json(card);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update card
router.put('/cards/:id', async (req, res) => {
  try {
    const card = await Card.findOneAndUpdate(
      { id: req.params.id },
      { customer_url: req.body.customerUrl,
        is_sold: true  // Add this line to set is_sold to true
      },
      { new: true }
    );
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.json(card);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Redirect
router.get('/r/:id', async (req, res) => {
  try {
    const card = await Card.findOne({ id: req.params.id });
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    // Redirect to customerUrl if it exists, otherwise use placeholderUrl
    res.redirect(card.customer_url || card.placeholder_url);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;