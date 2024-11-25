const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const QRCode = require('qrcode');
const cors = require('cors');

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect('REDACTED_MONGODB_URI', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// MongoDB Schema and Model
const cardSchema = new mongoose.Schema({
  id: { type: String, required: true },
  placeholder_url: { type: String, required: true },
  is_sold: { type: Boolean, default: false },
  customer_url: { type: String, default: null },
  qr_code: { type: String, required: true }, // Base64 QR code
});

const Card = mongoose.model('Card', cardSchema);

// Routes

// 1. Generate QR Code
app.post('/generate', async (req, res) => {
  const { placeholderUrl } = req.body;

  if (!placeholderUrl) {
    return res.status(400).json({ error: 'Placeholder URL is required' });
  }

  const cardId = `card-${Date.now()}`;
  const qrCode = await QRCode.toDataURL(`http://localhost:3000/redirect/${cardId}`);

  const newCard = new Card({
    id: cardId,
    placeholder_url: placeholderUrl,
    qr_code: qrCode,
  });

  try {
    await newCard.save();
    res.json(newCard);
  } catch (error) {
    console.error('Error saving card:', error);
    res.status(500).json({ error: 'Failed to save card' });
  }
});

// 2. Get All Cards
app.get('/cards', async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
});

// 3. Update Card's Customer URL
app.post('/update/:cardId', async (req, res) => {
    const { cardId } = req.params; // Card ID from the URL
    const { customerUrl } = req.body; // New customer URL from the request body
  
    if (!customerUrl) {
      return res.status(400).json({ error: 'Customer URL is required' });
    }
  
    try {
      const card = await Card.findOne({ id: cardId }); // Fetch the card from MongoDB
      if (!card) {
        return res.status(404).json({ error: 'Card not found' }); // If card is not found
      }
  
      // Update only the customer URL (allow regardless of sold status)
      card.customer_url = customerUrl;
  
      // Optionally, mark it as sold if it wasn't sold before
      if (!card.is_sold) {
        card.is_sold = true;
      }
  
      await card.save(); // Save the updated card back to the database
      res.json({ success: true, card }); // Respond with the updated card
    } catch (error) {
      console.error('Error updating card:', error);
      res.status(500).json({ error: 'Failed to update card' });
    }
  });
  
  

// 4. Redirect Endpoint (optional)
app.get('/redirect/:cardId', async (req, res) => {
  const { cardId } = req.params;

  try {
    const card = await Card.findOne({ id: cardId });
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    const redirectUrl = card.is_sold ? card.customer_url : card.placeholder_url;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Error handling redirect:', error);
    res.status(500).json({ error: 'Failed to handle redirect' });
  }
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
