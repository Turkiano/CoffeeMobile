import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// For development: use machine IP so mobile can reach backend
// For production: use Azure URL
let baseURL = "http://192.168.8.101:5125/api/v1";

const api = axios.create({
  baseURL,
});

// Interceptor to add Authorization token from AsyncStorage
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Failed to read token from AsyncStorage", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
