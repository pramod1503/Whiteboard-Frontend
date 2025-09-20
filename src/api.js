import axios from "axios";

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});
