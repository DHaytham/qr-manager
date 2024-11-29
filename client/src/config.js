
const CONFIG = {
  API_BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://qr-manager-45y0.onrender.com'
    : 'http://localhost:5000'
};
  
  export default CONFIG;
