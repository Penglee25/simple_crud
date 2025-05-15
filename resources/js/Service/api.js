import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api', 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const get = (url, config = {}) => apiClient.get(url, config);
export const post = (url, data, config = {}) => apiClient.post(url, data, config);
export const put = (url, data, config = {}) => apiClient.put(url, data, config);
export const del = (url, config = {}) => apiClient.delete(url, config);

export default apiClient;