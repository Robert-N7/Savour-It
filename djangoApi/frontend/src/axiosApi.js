import axios from 'axios';


function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].toString().replace(/^([\s]*)|([\s]*)$/g, "");
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

/**
 * Axios default request that authenticates
 */
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api/',
    timeout: 15000,
    headers: {
        'Authorization': "JWT " + localStorage.getItem('access_token'),
        'Content-Type': 'application/json'
        // 'X-CSRFToken': getCookie('csrftoken')
    },
    skipIntercept: false
});


axiosInstance.interceptors.request.use((request) => {
    console.log(request);
    return request;
});

// Interceptor to handle refreshing JWT tokens
axiosInstance.interceptors.response.use(
    response => {
        console.log(response);
        return response;
    },
    error => {
      const originalRequest = error.config;
      if (error.response && error.response.status === 401 && error.response.statusText === "Unauthorized" 
            && !axiosInstance.skipIntercept) {
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
                  
                  return axiosInstance(originalRequest);
              })
              .catch(err => {
                  console.log(err)
              }).finally((x) => {
                  axiosInstance.skipIntercept = false;
                  if(x)
                    return x;
              })
      }
      return Promise.reject(error);
  }
);

export default axiosInstance
