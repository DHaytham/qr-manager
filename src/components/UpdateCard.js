import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  Container,
  CircularProgress,
  Grid,
  Card,
  CardContent,
} from '@mui/material';

const UpdateCard = () => {
  const [cards, setCards] = useState([]); // All cards
  const [filteredCards, setFilteredCards] = useState([]); // Cards after filtering
  const [selectedCard, setSelectedCard] = useState(null); // Selected card for update
  const [newCustomerUrl, setNewCustomerUrl] = useState(''); // New URL for the card
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(''); // Feedback message
  const [searchTerm, setSearchTerm] = useState(''); // Search term for filtering

  // Fetch all cards from the backend
  const fetchCards = async () => {
    try {
      const response = await fetch('http://localhost:3000/cards');
      const data = await response.json();
      setCards(data);
      setFilteredCards(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cards:', error);
      setMessage('Failed to load cards. Please try again.');
      setLoading(false);
    }
  };

  // Filter cards based on the search term (for URL search)
  const handleSearchChange = (event) => {
    const searchQuery = event.target.value;
    setSearchTerm(searchQuery);

    // Filter cards based on the URL
    const filtered = cards.filter((card) =>
      card.customer_url && card.customer_url.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCards(filtered);
  };

  // Update a card's URL
  const updateCard = async () => {
    if (!selectedCard || !newCustomerUrl.trim()) {
      setMessage('Please select a card and enter a valid URL.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/update/${selectedCard.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerUrl: newCustomerUrl }),
      });

      if (response.ok) {
        setMessage('Card updated successfully!');
        setNewCustomerUrl(''); // Clear the input
        fetchCards(); // Refresh the card list
      } else {
        const data = await response.json();
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      setMessage('Failed to update card. Please try again.');
    }
  };

  // Fetch cards when the component mounts
  useEffect(() => {
    fetchCards();
  }, []);

  // Show a loading spinner until cards are fetched
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
        Update QR Code URL
      </Typography>

      {/* Search Input for filtering cards */}
      <TextField
        fullWidth
        label="Search by Customer URL"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ mb: 3 }}
      />

      {/* Search results list */}
      <Box sx={{ maxHeight: 300, overflowY: 'auto', mb: 3 }}>
        <List>
          {filteredCards.map((card) => (
            <ListItem
              key={card.id}
              button
              onClick={() => {
                setSelectedCard(card);
                setSearchTerm(card.customer_url); // Set the search term to the selected card's URL
              }}
            >
              <ListItemText
                primary={card.customer_url}
                secondary={`Card ID: ${card.id} | Sold: ${card.is_sold ? 'Yes' : 'No'}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Selected Card Info */}
      {selectedCard && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">Selected Card</Typography>
          <Typography variant="body1">Card ID: {selectedCard.id}</Typography>
          <Typography variant="body2" color="textSecondary">
            Customer URL: {selectedCard.customer_url || 'Not Sold Yet'}
          </Typography>
        </Box>
      )}

      {/* New Customer URL Input */}
      <TextField
        fullWidth
        label="New Customer URL"
        value={newCustomerUrl}
        onChange={(e) => setNewCustomerUrl(e.target.value)}
        placeholder="Enter new customer URL"
        sx={{ mb: 3 }}
      />

      {/* Update Button */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={updateCard}
          disabled={!selectedCard || !newCustomerUrl.trim()}
        >
          Update URL
        </Button>
      </Box>

      {/* Feedback Message */}
      {message && (
        <Typography variant="body1" color={message.includes('successfully') ? 'primary' : 'error'}>
          {message}
        </Typography>
      )}
    </Container>
  );
};

export default UpdateCard;
