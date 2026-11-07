import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Container, TextField, Typography } from '@mui/material';
import api, { setToken, errorMessage } from '../api';

const Login = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/login', { password });
      setToken(data.token);
      navigate('/', { replace: true });
    } catch (err) {
      setError(errorMessage(err, 'Could not log in. Please try again.'));
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
        Admin login
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          sx={{ mb: 2 }}
        />
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Button fullWidth type="submit" variant="contained" disabled={loading || !password}>
          {loading ? 'Logging in…' : 'Log in'}
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
