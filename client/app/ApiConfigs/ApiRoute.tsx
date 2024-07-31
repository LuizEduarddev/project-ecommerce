import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.134.26:8080/',
});

export default api;