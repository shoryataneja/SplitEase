import axios from "axios";

const API = axios.create({
 baseURL: "https://splitease-backend-hmsf.onrender.com/api"
});

//  Attach token automatically
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    console.log("[API] Making request to:", req.url);
    console.log("[API] Token exists:", !!token);

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
      console.log("[API] Authorization header set");
    } else {
      console.log("[API] No token found in localStorage");
    }

    return req;
  },
  (error) => {
    console.error("[API] Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("[API] Response error:", error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      console.log("[API] 401 Unauthorized - clearing localStorage and redirecting to login");
      localStorage.clear();
      window.location.href = "/login";
    }
    
    return Promise.reject(error);
  }
);

export default API;
