import axios from 'axios';
import { apiConfig } from '../config/api.config';
import { setupInterceptors } from './interceptors';

const api = axios.create(apiConfig);

setupInterceptors(api);

export default api;
