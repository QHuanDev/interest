import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "https://interest-chwi.onrender.com/api/"
    : "/api";
// Tạo instance axios với config mặc định
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
