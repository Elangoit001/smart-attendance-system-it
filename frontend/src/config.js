const API_BASE_URL = window.location.hostname === 'localhost'
    ? `http://localhost:5000/api`
    : `https://8c63e339b67f9be0-157-51-72-89.serveousercontent.com/api`;
export default API_BASE_URL;
