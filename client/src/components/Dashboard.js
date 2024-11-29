import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CONFIG from '../config';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  CardMedia,
  Divider,
  Container,
  CircularProgress,
  TextField,
} from '@mui/material';

const Dashboard = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(''); // New state for filter input

  useEffect(() => {
    axios
      .get(`${CONFIG.API_BASE_URL}/api/cards`)  // Add /api prefix
      .then((response) => {
        console.log('Cards response:', response.data); // Debug log
        setCards(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching cards:', error);
        setLoading(false);
      });
  }, []);
  // Filter cards based on the card ID
  const filteredCards = cards.filter((card) =>
    card.id.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        QR Code Dashboard
      </Typography>

      {/* Generate Button */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Button
          component={Link}
          to="/generate"
          variant="contained"
          color="primary"
          sx={{ paddingX: 4, paddingY: 1 }}
        >
          Generate New QR Code
        </Button>
      </Box>

      {/* Filter Section */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <TextField
          label="Filter by Card ID"
          variant="outlined"
          value={filter}
          onChange={(e) => setFilter(e.target.value)} // Update filter state
          fullWidth
        />
      </Box>

      {/* List of Cards */}
      <Grid container spacing={3}>
        {filteredCards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.id}>
            <Card elevation={3}>
              <CardMedia
                component="img"
                height="200"
                image={card.qr_code}
                alt="QR Code"
                sx={{ objectFit: 'contain', p: 2 }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Card ID: {card.id}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Redirect URL: {card.is_sold ? card.customer_url : card.placeholder_url}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ textAlign: 'center' }}>
                  <Button
                    component={Link}
                    to={`/update/${card.id}`}
                    variant="contained"
                    color="secondary"
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    Update
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    href={card.is_sold ? card.customer_url : card.placeholder_url}
                    target="_blank"
                  >
                    Visit
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
