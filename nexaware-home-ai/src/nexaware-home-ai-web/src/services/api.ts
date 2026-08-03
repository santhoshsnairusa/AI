import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Proxy via Nginx in Docker or Vite in dev
  headers: {
    'Content-Type': 'application/json'
  }
});

export const DEMO_HOUSEHOLD_ID = '00000000-0000-0000-0000-000000000001';
export const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001';

export default api;
