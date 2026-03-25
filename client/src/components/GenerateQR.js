import React, { useState } from 'react';
import axios from 'axios';
import CONFIG from '../config';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
} from '@mui/material';

const GenerateQR = () => {
  const [customerUrl, setCustomerUrl] = useState('');
  const [generatedCard, setGeneratedCard] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    if (!customerUrl.trim()) {
      alert('Please enter a website URL');
      return;
    }
    setLoading(true);

    axios
      .post(`${CONFIG.API_BASE_URL}/api/generate`, { customerUrl })
      .then((response) => {
        console.log('Success:', response.data); 
        setGeneratedCard(response.data);
        setCustomerUrl(''); // Clear the input
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error generating QR code:', error);
        setLoading(false);
      });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
        Generate QR Code
      </Typography>

      {/* Input for Website URL */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Enter Website URL"
          variant="outlined"
          value={customerUrl}
          onChange={(e) => setCustomerUrl(e.target.value)}
          placeholder="https://example.com"
          helperText="Enter the website URL you want the QR code to link to."
        />
      </Box>

      {/* Generate Button */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerate}
          disabled={loading || !customerUrl.trim()}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate'}
        </Button>
      </Box>

      {/* Display Generated QR Code */}
      {generatedCard && (
        <Card elevation={3}>
          <CardMedia
            component="img"
            image={generatedCard.qr_code}
            alt="Generated QR Code"
            sx={{ height: 200, objectFit: 'contain', p: 2 }}
          />
          <CardContent>
            <Typography variant="h6">Card ID: {generatedCard.id}</Typography>
            <Typography variant="body2" color="textSecondary">
              Links to: {generatedCard.customer_url}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default GenerateQR;
