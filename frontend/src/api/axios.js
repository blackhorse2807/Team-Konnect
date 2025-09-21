import axios from 'axios';

// Create an axios instance with a base URL
const API_URL = 'http://localhost:9000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (!error.response) {
      console.error('Network Error: Could not connect to the server. Please make sure the backend is running.');
    }
    return Promise.reject(error);
  }
);

export default api;
