const API_BASE_URL = window.location.hostname === 'localhost'
    ? `http://localhost:5000/api`
    : `https://witty-tables-check.loca.lt/api`;
export default API_BASE_URL;
