import axios from 'axios';
import { useToast } from 'primevue/usetoast';

const apiClient = axios.create({
  baseURL: '/api', 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const showToast = (type = 'success', summary = '', detail = '') => {
  const toast = useToast();
  toast.add({
    severity: type,
    summary,
    detail,
    life: 3000,
  });
};

export const get = async (url, config = {}) => {
  try {
    const response = await apiClient.get(url, config);
    return response;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const post = async (url, data, config = {}, showSuccess = true) => {
  try {
    const response = await apiClient.post(url, data, config);
    if (showSuccess) {
      showToast('success', 'Success', 'Data submitted successfully.');
    }
    return response;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const put = async (url, data, config = {}, showSuccess = true) => {
  try {
    const response = await apiClient.put(url, data, config);
    if (showSuccess) {
      showToast('success', 'Updated', 'Data updated successfully.');
    }
    return response;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const del = async (url, config = {}, showSuccess = true) => {
  try {
    const response = await apiClient.delete(url, config);
    if (showSuccess) {
      showToast('success', 'Deleted', 'Item deleted successfully.');
    }
    return response;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

function handleApiError(error) {
  const toast = useToast();
  if (error.response?.status === 422) {
    toast.add({
      severity: 'warn',
      summary: 'Validation Error',
      detail: 'Please correct the highlighted fields.',
    });
  } else {
    toast.add({
      severity: 'error',
      summary: 'API Error',
      detail: error.response?.data?.message || 'An error occurred.',
    });
  }
}

export default apiClient;