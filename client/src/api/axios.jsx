import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  function (response) {
    console.log("Response received: ", response.status);
    return response;
  },
  function (error) {
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized redirect to login");
    }
    return Promise.reject(error);
  }
);

export default api;
