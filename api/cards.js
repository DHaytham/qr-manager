import connectToDatabase from './db';
import { Card } from './models/Card';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await connectToDatabase();
      const cards = await Card.find();
      res.status(200).json(cards);
    } catch (error) {
      console.error('Error fetching cards:', error);
      res.status(500).json({ error: 'Failed to fetch cards' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
