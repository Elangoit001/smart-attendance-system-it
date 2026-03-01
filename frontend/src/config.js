const API_BASE_URL = import.meta.env.VITE_API_URL ||
    (window.location.hostname === 'localhost'
        ? 'http://localhost:5000/api'
        : '/api');

export default API_BASE_URL;
