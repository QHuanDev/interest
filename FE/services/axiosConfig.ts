import axios from "axios";

// Tạo instance axios với config mặc định
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - có thể thêm token, log request, etc.
axiosInstance.interceptors.request.use(
  (config) => {
    // Có thể thêm token vào header ở đây nếu cần
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - xử lý response/error chung
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Xử lý các lỗi chung ở đây
    if (error.response) {
      // Server trả về response với status code ngoài 2xx
      console.error(
        "Response Error:",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      // Request được gửi nhưng không nhận được response
      console.error("Network Error:", error.message);
    } else {
      // Có lỗi khi setup request
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
