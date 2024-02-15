import axios from 'axios';

// Set up initial api instance
const instance = axios.create({
  baseURL: process.env.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // eslint-disable-next-line prettier/prettier
  },
});

export default instance;
