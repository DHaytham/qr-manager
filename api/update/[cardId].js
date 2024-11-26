import connectToDatabase from '../../db';
import { Card } from '../../models/Card';

export default async function handler(req, res) {
  const { cardId } = req.query;

  if (req.method === 'POST') {
    const { customerUrl } = req.body;

    if (!customerUrl) {
      return res.status(400).json({ error: 'Customer URL is required' });
    }

    try {
      await connectToDatabase();
      const card = await Card.findOne({ id: cardId });

      if (!card) {
        return res.status(404).json({ error: 'Card not found' });
      }

      card.customer_url = customerUrl;
      card.is_sold = true;
      await card.save();

      res.status(200).json({ success: true, card });
    } catch (error) {
      console.error('Error updating card:', error);
      res.status(500).json({ error: 'Failed to update card' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}