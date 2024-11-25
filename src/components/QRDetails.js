import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';

const QRDetails = ({ card, onClose }) => {
  const [newCustomerUrl, setNewCustomerUrl] = useState(''); // Input for new customer URL
  const [message, setMessage] = useState(''); // Feedback message
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar visibility

  // Handle the "Update URL" action
  const handleUpdate = () => {
    if (!newCustomerUrl.trim()) {
      setMessage('Please enter a valid URL.');
      setOpenSnackbar(true);
      return;
    }

    axios
      .post(`http://localhost:3000/update/${card.id}`, { customerUrl: newCustomerUrl })
      .then(() => {
        setMessage('URL updated successfully!');
        setOpenSnackbar(true);
        setNewCustomerUrl(''); // Clear input after success
      })
      .catch(() => {
        setMessage('Failed to update the URL. Please try again.');
        setOpenSnackbar(true);
      });
  };

  return (
    <Box sx={{ padding: 3, maxWidth: 600, margin: 'auto' }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            QR Code Details
          </Typography>

          {/* Details Grid */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography>
                <strong>ID:</strong> {card.id}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                <strong>Created At:</strong> {new Date(card.created_at).toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                <strong>Name:</strong> {card.name}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                <strong>Contents:</strong>{' '}
                {card.is_sold ? card.customer_url : card.placeholder_url}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                <strong>Short URL:</strong> {card.short_url || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                <strong>Data Type:</strong> {card.data_type || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                <strong>Hits:</strong> {card.hits || 0}
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <img src={card.qr_code} alt="QR Code" width="200" />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Update URL Section */}
          <Typography variant="h6" gutterBottom>
            Update Customer URL
          </Typography>
          <TextField
            fullWidth
            label="New Customer URL"
            variant="outlined"
            value={newCustomerUrl}
            onChange={(e) => setNewCustomerUrl(e.target.value)}
            placeholder="Enter new URL"
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            sx={{ width: '100%' }}
          >
            Update
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={onClose}
            sx={{ mt: 2, width: '100%' }}
          >
            Close
          </Button>
        </CardContent>
      </Card>

      {/* Snackbar for feedback */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={message.includes('successfully') ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default QRDetails;
