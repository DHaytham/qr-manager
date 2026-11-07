const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const express = require('express');
const helmet = require('helmet');
const { connectDB } = require('./config/db');
const { getAdminPassword, DEV_DEFAULT_PASSWORD } = require('./utils/auth');
const apiRoutes = require('./routes/api');
const redirectRoutes = require('./routes/redirect');

const app = express();
const clientBuild = path.join(__dirname, '../client/build');

// Render (and most hosts) sit behind one proxy; needed for correct client IPs and https URLs.
app.set('trust proxy', 1);

app.use(helmet());
app.use(express.json({ limit: '10kb' }));

// Used by Render's health check and the keep-alive ping.
app.get('/health', (req, res) => res.json({ ok: true }));

// Public QR redirects (must come before the React catch-all).
app.use(redirectRoutes);

// Admin API.
app.use('/api', apiRoutes);

// React app.
app.use(express.static(clientBuild));
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuild, 'index.html'), (err) => {
    if (err) res.status(404).send('Frontend not built. Run "npm run build" first.');
  });
});

// Error handler (must be registered last).
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

const PORT = process.env.PORT || 5000;

async function start() {
  if (!getAdminPassword()) {
    console.warn('WARNING: ADMIN_PASSWORD is not set, so nobody can log in to the dashboard.');
  } else if (!process.env.ADMIN_PASSWORD) {
    console.warn(`Using the development password "${DEV_DEFAULT_PASSWORD}". Set ADMIN_PASSWORD in .env.`);
  }

  try {
    await connectDB();
  } catch (err) {
    console.error('Failed to connect to PostgreSQL:', err.message);
    process.exit(1);
  }

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

process.on('unhandledRejection', (err) => {
  console.error('Unhandled promise rejection:', err);
});

start();
