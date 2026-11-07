import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import api, { errorMessage } from '../api';

const GenerateQR = () => {
  const [customerUrl, setCustomerUrl] = useState('');
  const [generatedCard, setGeneratedCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/generate', { customerUrl });
      setGeneratedCard(data);
      setCustomerUrl('');
    } catch (err) {
      setError(errorMessage(err, 'Could not generate the QR code.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ my: 4 }}>
      <Button component={Link} to="/" sx={{ mb: 2 }}>
        ← Back to dashboard
      </Button>
      <Typography variant="h4" gutterBottom>
        Generate QR code
      </Typography>

      <Box component="form" onSubmit={handleGenerate} sx={{ mb: 4 }}>
        <TextField
          fullWidth
          label="Website (optional)"
          value={customerUrl}
          onChange={(e) => setCustomerUrl(e.target.value)}
          placeholder="https://example.com"
          helperText="Leave empty to create a blank card and link it to a website later."
          sx={{ mb: 2 }}
        />
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate'}
        </Button>
      </Box>

      {generatedCard && (
        <Card elevation={3}>
          <CardMedia
            component="img"
            image={generatedCard.qr_code}
            alt="Generated QR code"
            sx={{ height: 240, objectFit: 'contain', p: 2 }}
          />
          <CardContent>
            <Typography variant="h6">Card {generatedCard.id}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
              Goes to: {generatedCard.customer_url || 'nothing yet (blank card)'}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              href={generatedCard.qr_code}
              download={`qr-${generatedCard.id}.png`}
              sx={{ mt: 2 }}
            >
              Download PNG
            </Button>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default GenerateQR;
