import axios from "axios";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const API_BASE_URL = (
  configuredApiUrl ||
  (import.meta.env.DEV
    ? "http://localhost:8085"
    : "https://shopkart-rbkz.onrender.com")
).replace(/\/+$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default api;