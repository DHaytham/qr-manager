import QRCode from 'qrcode';
import connectToDatabase from '../db';
import { Card } from '../models/Card';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { placeholderUrl } = req.body;

    if (!placeholderUrl) {
      return res.status(400).json({ error: 'Placeholder URL is required' });
    }

    try {
      await connectToDatabase();
      const cardId = `card-${Date.now()}`;
      const qrCode = await QRCode.toDataURL(`https://${req.headers.host}/api/redirect/${cardId}`);

      const newCard = new Card({ id: cardId, placeholder_url: placeholderUrl, qr_code: qrCode });
      await newCard.save();

      res.status(200).json(newCard);
    } catch (error) {
      console.error('Error generating QR code:', error);
      res.status(500).json({ error: 'Failed to generate QR code' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}