import axios from 'axios';

/**
 * This module makes api calls using axios, and authenticates using JWT
 */

const DEBUG = false;

async function createUser(credentials) {
    try {
        let response = await this.post('/user/create/', credentials);
        console.log('Created user ' + credentials.username);
        response = await this.login(credentials); 
        return response;
    
    } catch(error) {
        Promise.reject(error);
    }
}


/**
 * Logs in, attached to axios Api
 * @param {Dict with username and password} credentials 
 * @param {callback} onFulfilled 
 * @param {callback} onRejected 
 */
async function login(credentials, onFulfilled=null, onRejected=null) {
    try {
        let response = await this.post('/token/obtain/', credentials);
        this.user = credentials.username;
        this.onLogin(response);
        if(onFulfilled)
            onFulfilled(response);
        return response;
    } catch(err) {
        if(onRejected)
            onRejected(err);
        Promise.reject(err);
    }    
}

/**
 * Logs the user out
 */
function logout(callback=null) {
    this.onLogout()
    if(callback)
        callback()
}


/**
 * Handles setting and storing the JWT token once a user successfully logs in, bound to axios and not used directly
 * @param {HTTP_Response} response 
 */
function onLogin(response) {
    this.defaults.headers['Authorization'] = "JWT " + response.data.access;
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    this.isAuthenticated = true;
    if(this.loginCallback)
        this.loginCallback();
    return response
}

/**
 * Used for logging out, removes tokens
 * Bound to axios instance
 */
function onLogout() {
    this.defaults.headers['Authorization'] = null;
    localStorage.setItem('access_token', '');
    localStorage.setItem('refresh_token', '');
    this.isAuthenticated = false;
    if(this.logoutCallback)
        this.logoutCallback();
}

/**
 * Interceptor to handle refreshing JWT token, bound to axios object and not used directly
 * @param {*} error
 */
function errIntercept(error) {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && error.response.statusText === "Unauthorized" 
            && !this.skipIntercept) {
        const refresh_token = localStorage.getItem('refresh_token');
        // Ensure we don't infinitely loop messages with server
        this.skipIntercept = true;
        return this
            .post('/token/refresh/', {refresh: refresh_token})
            .then((response) => {

                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);

                this.defaults.headers['Authorization'] = "JWT " + response.data.access;
                originalRequest.headers['Authorization'] = "JWT " + response.data.access;
                this.isAuthenticated = true;

                return this(originalRequest);
            })
            .catch(err => {
                console.log(err);
                this.isAuthenticated = false;
                this.redirect();
            }).finally((x) => {
                this.skipIntercept = false;
                if(x)
                    return x;
            })
    }
    return Promise.reject(error);
}


/**
 * Initialized axios instance
 * @param {*} debug
 * returns instance
 */
function initAxiosInstance(debug=false) {
    let auth = null;
    const token = localStorage.getItem('access_token');
    if(token)
        auth = "JWT " + token;
    const instance = axios.create({
        baseURL: 'http://localhost:8000/api/',
        timeout: 3000,
        headers: {
            'Authorization': auth,
            'Content-Type': 'application/json'
        },
        user: null,
        isAuthenticated: false,
        skipIntercept: false,
        createUser: null,
        login: null,
        onLogin: null,
        loginCallback: null,
        logout: null,
        onLogout: null,
        logoutCallback: null,
        errIntercept: null,
        redirect: null
    });
    if(auth)
        instance.isAuthenticated = true;
    // if(debug) {
    //     if(instance.isAuthenticated)
    //         console.log('User has authentication tokens');
    //     else
    //         console.log('User is not signed in');
    // }
    instance.login = login.bind(instance);
    instance.onLogin = onLogin.bind(instance);
    instance.logout = logout.bind(instance);
    instance.onLogout = onLogout.bind(instance);
    instance.createUser = createUser.bind(instance);

    // Interceptors
    if(debug) {
        instance.interceptors.request.use((request) => {
            console.log(request.method + ' request ' + request.url);
            return request;
        }, (err) => {
            console.log(err);
            return Promise.reject(err)
        }
        );
    }

    let responseIntercept;
    if(debug) {
        responseIntercept = function(response) { 
            console.log(response.status + ' response');
            return response;
        }
    } else {
        responseIntercept = function(response) { return response; };
    }
    instance.errIntercept = errIntercept.bind(instance);
    
    // Interceptor to handle refreshing JWT tokens
    instance.interceptors.response.use(
        responseIntercept,
        instance.errIntercept
    );

    return instance;    
}

// Global Instance 
const axiosInstance = initAxiosInstance(DEBUG);

export default axiosInstance
