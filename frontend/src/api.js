import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_BASE_URL
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers = config.headers || {};
        config.headers['x-auth-token'] = token;
    }

    return config;
});

export const getApiErrorMessage = (error, fallback) => {
    const data = error.response?.data;

    if (data?.msg) return data.msg;
    if (data?.message) return data.message;
    if (typeof data === 'string' && data.trim()) return data;

    return fallback;
};

export default api;
