import axios from "axios";
import { BASE_URL } from "../utils/constant.js";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // for sending/receiving cookies
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    console.log(prom);
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response, //if status 200 no change
  async (error) => {
    const originalRequest = error.config;

    console.log("->>>>>>>>>>>> inside refresh", originalRequest);
    // Intercept 401 from access token expiration
    const isTokenExpired =
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry

    if (isTokenExpired && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;
      try {
        const res = await axios.post(
          `${BASE_URL}/user/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;

        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken); //all pending promise while it was refreshing token will be resolve or reject
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
