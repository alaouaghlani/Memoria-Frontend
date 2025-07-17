import axios from 'axios';
import { store } from '.';

const Intersptor = axios.create({
  timeout: 30000,
});

Intersptor.interceptors.request.use(
  (config) => {
    config.headers = {
      ...config.headers,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    // Check for FormData data and set Content-Type if needed
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }

    if (store.getState().authentification.token) {
      config.headers.Authorization = `Bearer ${store.getState().authentification.token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default Intersptor;
