import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 예: http://localhost:8080
  withCredentials: true, // 쿠키/세션 필요하면 true
});