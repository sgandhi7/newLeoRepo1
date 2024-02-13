import axios from 'axios';

const instance = axios.create({
  withCredentials: true,
  baseURL: process.env.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // eslint-disable-next-line prettier/prettier
    'Authorization': process.env.API_KEY,
    'azureml-model-deployment': 'dvasquez-seattle-vcqoi-2',
    'Access-Control-Allow-Origin': '*',
  },
});

export default instance;
