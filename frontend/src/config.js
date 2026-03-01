const API_BASE_URL = window.location.hostname === 'localhost'
    ? `http://localhost:5000/api`
    : `https://beige-books-tease.loca.lt/api`;
export default API_BASE_URL;
