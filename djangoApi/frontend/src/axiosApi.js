import axios from 'axios';

/**
 * Axios default request that authenticates
 */
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api/',
    timeout: 15000,
    headers: {
        'Authorization': "JWT " + localStorage.getItem('access_token'),
        'Content-Type': 'application/json',
        'accept': 'application/json',
    },
    skipIntercept: false
});

// Interceptor to handle refreshing JWT tokens
axiosInstance.interceptors.response.use(
    response => response,
    error => {
      const originalRequest = error.config;
      if (error.response.status === 401 && error.response.statusText === "Unauthorized" && !axiosInstance.skipIntercept) {
          const refresh_token = localStorage.getItem('refresh_token');
          // Ensure we don't infinitely loop messages with server
          axiosInstance.skipIntercept = true;
          return axiosInstance
              .post('/token/refresh/', {refresh: refresh_token}, {skipIntercept: true})
              .then((response) => {

                  localStorage.setItem('access_token', response.data.access);
                  localStorage.setItem('refresh_token', response.data.refresh);

                  axiosInstance.defaults.headers['Authorization'] = "JWT " + response.data.access;
                  originalRequest.headers['Authorization'] = "JWT " + response.data.access;
                  axiosInstance.skipIntercept = false;
                  
                  return axiosInstance(originalRequest);
              })
              .catch(err => {
                  axiosInstance.skipIntercept = false;
                  console.log(err)
              })
      }
      return Promise.reject(error);
  }
);

export default axiosInstance
