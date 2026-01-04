import axios from "axios";

// Create an instance with your FastAPI base URL
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

export default api;