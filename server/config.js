const CONFIG = {
    API_BASE_URL: process.env.NODE_ENV === 'production' 
      ? 'http://localhost:5000'
      : 'https://b1bd-212-218-15-65.ngrok-free.app'
  };

  module.exports = CONFIG;