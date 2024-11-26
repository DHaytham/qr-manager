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
  const [placeholderUrl, setPlaceholderUrl] = useState('');
  const [generatedCard, setGeneratedCard] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    if (!placeholderUrl.trim()) return; // Prevent empty submissions
    setLoading(true);

    axios
      .post(`${CONFIG.API_BASE_URL}/generate`, { placeholderUrl })
      .then((response) => {
        console.log('Success:', response.data); 
        setGeneratedCard(response.data);
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

      {/* Input for Placeholder URL */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Enter Placeholder URL"
          variant="outlined"
          value={placeholderUrl}
          onChange={(e) => setPlaceholderUrl(e.target.value)}
          helperText="Enter a temporary URL for the QR code."
        />
      </Box>

      {/* Generate Button */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerate}
          disabled={loading || !placeholderUrl.trim()}
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
              Placeholder URL: {generatedCard.placeholder_url}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default GenerateQR;
