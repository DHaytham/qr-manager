require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const QRCode = require('qrcode');
const Card = require('./models/Card');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || 'REDACTED_MONGODB_URI')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });

// Counter model
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

// Get next sequence
const getNextSequence = async () => {
  const counter = await Counter.findOneAndUpdate(
    { _id: 'cardId' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return String(counter.seq).padStart(6, '0');
};

// Routes
app.post('/generate', async (req, res) => {
  const { placeholderUrl } = req.body;

  if (!placeholderUrl) {
    return res.status(400).json({ error: 'Placeholder URL is required' });
  }

  try {
    const cardId = `qrm${await getNextSequence()}`;
    const qrCode = await QRCode.toDataURL(`${process.env.BASE_URL || 'https://qr-code-manager-q5zd.onrender.com'}/redirect/${cardId}`);

    const newCard = new Card({
      id: cardId,
      placeholder_url: placeholderUrl,
      qr_code: qrCode,
    });

    await newCard.save();
    res.json(newCard);
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

app.get('/cards', async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
});

app.get('/cards/:id', async (req, res) => {
  try {
    const card = await Card.findOne({ id: req.params.id });
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }
    res.json(card);
  } catch (error) {
    console.error('Error fetching card:', error);
    res.status(500).json({ error: 'Failed to fetch card' });
  }
});

app.post('/update/:id', async (req, res) => {
  const { customerUrl } = req.body;
  try {
    const card = await Card.findOneAndUpdate(
      { id: req.params.id },
      { customer_url: customerUrl },
      { new: true }
    );
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }
    res.json(card);
  } catch (error) {
    console.error('Error updating card:', error);
    res.status(500).json({ error: 'Failed to update card' });
  }
});

app.get('/redirect/:id', async (req, res) => {
  try {
    const card = await Card.findOne({ id: req.params.id });
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }
    const redirectUrl = card.customer_url || card.placeholder_url;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Error redirecting:', error);
    res.status(500).json({ error: 'Failed to redirect' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});