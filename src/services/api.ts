import axios from "axios";

const isDevelopment = process.env.NODE_ENV === "development";

// Update this when you have a working backend
let baseURL = process.env.REACT_APP_API_URL || "http://localhost:5125/api/v1";

if (!isDevelopment) {
  // Update this when you have a working backend
  baseURL =
    "https://coffeeapp2026-dnc9cggsfrhpfxhh.canadacentral-01.azurewebsites.net/api/v1";
}

const api = axios.create({
  baseURL,
});

// Optional: Add interceptors for handling auth tokens
api.interceptors.request.use(
  (config) => {
    // Add token to requests if it exists
    const token = localStorage?.getItem?.("token") || null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
