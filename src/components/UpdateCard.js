import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Container, CircularProgress } from '@mui/material';

const UpdateCard = () => {
  const { cardId } = useParams(); // Get the card ID from the URL params
  const navigate = useNavigate(); // Use useNavigate to redirect after update

  const [card, setCard] = useState(null);
  const [newCustomerUrl, setNewCustomerUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Fetch the card data when the component loads
  useEffect(() => {
    const fetchCard = async () => {
      try {
        const response = await fetch(`http://localhost:3000/cards/${cardId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch card data');
        }
        const data = await response.json();
        setCard(data);
        setNewCustomerUrl(data.customer_url || ''); // Set the current URL if available
        setLoading(false);
      } catch (error) {
        console.error('Error fetching card data:', error);
        setMessage('Failed to fetch card data. Please try again.');
        setLoading(false);
      }
    };
    fetchCard();
  }, [cardId]);

  // Update the card's URL
  const handleUpdate = async () => {
    if (!newCustomerUrl.trim()) {
      setMessage('Please enter a valid URL.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/update/${cardId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerUrl: newCustomerUrl }),
      });

      if (response.ok) {
        setMessage('Card URL updated successfully!');
        setNewCustomerUrl(''); // Clear the input
        navigate('/'); // Redirect to the dashboard
      } else {
        const data = await response.json();
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      setMessage('Failed to update card. Please try again.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!card) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom color="error">
          Failed to load card data.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Update QR Code URL
      </Typography>

      {/* QR Code Display */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <img src={card.qr_code} alt="QR Code" width="150" />
        <Typography variant="h6" sx={{ mt: 2 }}>Card ID: {card.id}</Typography>
      </Box>

      {/* New Customer URL */}
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
        <Button variant="contained" color="primary" onClick={handleUpdate}>
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
