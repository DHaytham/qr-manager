import connectToDatabase from '../../db';
import { Card } from '../../models/Card';

export default async function handler(req, res) {
  const { cardId } = req.query;

  if (req.method === 'GET') {
    try {
      await connectToDatabase();
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
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}