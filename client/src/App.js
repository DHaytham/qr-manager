import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import Dashboard from './components/Dashboard';
import GenerateQR from './components/GenerateQR';
import UpdateCard from './components/UpdateCard';
import Login from './components/Login';
import { getToken, setToken } from './api';

function RequireAuth({ children }) {
  return getToken() ? children : <Navigate to="/login" replace />;
}

function Header() {
  const navigate = useNavigate();
  useLocation(); // re-render on navigation so the logout button appears/disappears
  const loggedIn = Boolean(getToken());

  const logout = () => {
    setToken(null);
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}
        >
          QR Code Manager
        </Typography>
        {loggedIn && (
          <Button color="inherit" onClick={logout}>
            Log out
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/generate" element={<RequireAuth><GenerateQR /></RequireAuth>} />
        <Route path="/update/:cardId" element={<RequireAuth><UpdateCard /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
