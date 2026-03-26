const isProduction = process.env.NODE_ENV === 'production';

const CONFIG = {
  API_BASE_URL:
    process.env.PUBLIC_BASE_URL ||
    process.env.API_BASE_URL ||
    (isProduction ? 'https://qr-manager-45y0.onrender.com' : 'http://localhost:5000'),
};

module.exports = CONFIG;
