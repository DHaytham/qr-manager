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

      res.status(200).json(card);
    } catch (error) {
      console.error('Error fetching card:', error);
      res.status(500).json({ error: 'Failed to fetch card' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
