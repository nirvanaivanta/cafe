import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // ganti sesuai backend kamu
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
