const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const Card = require('../models/Card');
const CONFIG = require('../config');

// Generate QR Code
router.post('/generate', async (req, res) => {
  try {
    const uniqueId = `card-${Date.now()}`;
    const { customerUrl } = req.body;
    const redirectUrl = `${CONFIG.API_BASE_URL}/api/r/${uniqueId}`;
    
    // Generate QR code with the redirect URL
    const qrCode = await QRCode.toDataURL(redirectUrl);

    const card = await Card.create({
      id: uniqueId,
      placeholder_url: redirectUrl,
      qr_code: qrCode,
      customer_url: customerUrl || null,
      is_sold: customerUrl ? true : false,
    });
    res.status(201).json(card);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all cards
router.get('/cards', async (req, res) => {
  try {
    const cards = await Card.findAll({ order: [['createdAt', 'DESC']] });
    res.json(cards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch card for update

router.get('/cards/:id', async (req, res) => {
  try {
    const card = await Card.findOne({ where: { id: req.params.id } });
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
    const [updatedRowsCount] = await Card.update(
      { customer_url: req.body.customerUrl, is_sold: true },
      { where: { id: req.params.id } }
    );
    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: 'Card not found' });
    }
    const card = await Card.findOne({ where: { id: req.params.id } });
    res.json(card);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Redirect
router.get('/r/:id', async (req, res) => {
  try {
    const card = await Card.findOne({ where: { id: req.params.id } });
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    // Redirect to customerUrl if it exists
    if (card.customer_url) {
      res.redirect(card.customer_url);
    } else {
      res.status(404).json({ message: 'No URL set for this QR code' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;