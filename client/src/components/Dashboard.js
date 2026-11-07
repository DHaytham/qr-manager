import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import api, { errorMessage } from '../api';

const Dashboard = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    api
      .get('/cards')
      .then((response) => setCards(response.data))
      .catch((err) => setError(errorMessage(err, 'Could not load your QR codes.')))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (card) => {
    if (!window.confirm(`Delete card ${card.id}? Printed copies of this QR code will stop working.`)) {
      return;
    }
    try {
      await api.delete(`/cards/${card.id}`);
      setCards((current) => current.filter((c) => c.id !== card.id));
    } catch (err) {
      setError(errorMessage(err, 'Could not delete the card.'));
    }
  };

  const query = filter.trim().toLowerCase();
  const filteredCards = cards.filter(
    (card) =>
      card.id.toLowerCase().includes(query) ||
      (card.customer_url || '').toLowerCase().includes(query)
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
        }}
      >
        <Typography variant="h4">QR Codes ({cards.length})</Typography>
        <Button component={Link} to="/generate" variant="contained">
          Generate new QR code
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TextField
        label="Search by card ID or website"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        fullWidth
        sx={{ mb: 3 }}
      />

      {cards.length === 0 && !error && (
        <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 6 }}>
          No QR codes yet. Generate your first one.
        </Typography>
      )}

      <Grid container spacing={3}>
        {filteredCards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.id}>
            <Card elevation={3}>
              <CardMedia
                component="img"
                height="200"
                image={card.qr_code}
                alt={`QR code for card ${card.id}`}
                sx={{ objectFit: 'contain', p: 2 }}
              />
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">{card.id}</Typography>
                  <Chip
                    size="small"
                    label={card.is_sold ? 'Active' : 'Not assigned'}
                    color={card.is_sold ? 'success' : 'default'}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all', mt: 1 }}>
                  Goes to: {card.customer_url || '—'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Scans: {card.hits || 0}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                  <Button component={Link} to={`/update/${card.id}`} variant="contained" size="small">
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    href={card.qr_code}
                    download={`qr-${card.id}.png`}
                  >
                    Download
                  </Button>
                  {card.customer_url && (
                    <Button
                      variant="outlined"
                      size="small"
                      href={card.placeholder_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Test
                    </Button>
                  )}
                  <Button color="error" size="small" onClick={() => handleDelete(card)}>
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Dashboard;
