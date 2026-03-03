// src/api/axios.ts
import axios from 'axios';
import { apiConfig } from '../config/api.config';
import { setupInterceptors } from './interceptors';

const api = axios.create(apiConfig);

// setup interceptors AFTER creation
setupInterceptors(api);

export default api;