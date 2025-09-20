import axios from "axios";

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "https://whiteboard-backend-oryh.onrender.com/api",
  headers: { "Content-Type": "application/json" },
});
