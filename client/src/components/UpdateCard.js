import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import api, { errorMessage } from '../api';

const UpdateCard = () => {
  const { cardId } = useParams();
  const navigate = useNavigate();

  const [card, setCard] = useState(null);
  const [customerUrl, setCustomerUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/cards/${cardId}`)
      .then(({ data }) => {
        setCard(data);
        setCustomerUrl(data.customer_url || '');
      })
      .catch((err) => setError(errorMessage(err, 'Could not load this card.')))
      .finally(() => setLoading(false));
  }, [cardId]);

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.put(`/cards/${cardId}`, { customerUrl });
      navigate('/');
    } catch (err) {
      setError(errorMessage(err, 'Could not save the card.'));
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ my: 4 }}>
      <Button component={Link} to="/" sx={{ mb: 2 }}>
        ← Back to dashboard
      </Button>

      {!card ? (
        <Alert severity="error">{error || 'Card not found.'}</Alert>
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            Edit card {card.id}
          </Typography>

          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <img src={card.qr_code} alt={`QR code for card ${card.id}`} width="180" />
          </Box>

          <Box component="form" onSubmit={handleSave}>
            <TextField
              fullWidth
              label="Website"
              value={customerUrl}
              onChange={(e) => setCustomerUrl(e.target.value)}
              placeholder="https://example.com"
              helperText="Where scanning this QR code sends people. Leave empty to deactivate it."
              sx={{ mb: 2 }}
            />
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default UpdateCard;
