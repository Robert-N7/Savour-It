
const DEBUG = true;

async function createUser(credentials) {
    this.createUserCount += 1;
    return this.createUserCount;
}


async function login(credentials, onFulfilled=null, onRejected=null) {
    this.loginCount += 1;
    this.onLogin();
    return this.loginCount;
}

function logout(callback=null) {
    this.logoutCount += 1;
    this.onLogout();
}


function onLogin(response) {
    this.onLoginCount += 1;
}

function onLogout() {
    this.onLogoutCount += 1;
}



/**
 * Initialized axios instance
 * @param {*} debug
 * returns instance
 */
function initAxiosInstance(debug=true) {
    let auth = null;
    const instance = {};
    instance.baseURL = 'http://localhost:8000/api/';
    instance.timeout = 3000;
    instance.headers = {
            'Authorization': auth,
            'Content-Type': 'application/json'
        };
    instance.isAuthenticated = false;
    instance.skipIntercept = false;
    instance.loginCallback = null;
    instance.logoutCallback = null;
    instance.errIntercept = null;
    instance.redirect = null;
    instance.loginCount = 0;
    instance.logoutCount = 0;
    instance.onLoginCount = 0;
    instance.onLogoutCount = 0;
    instance.createUserCount = 0;
    instance.login = login.bind(instance);
    instance.onLogin = onLogin.bind(instance);
    instance.logout = onLogout.bind(instance);
    instance.onLogout = onLogout.bind(instance);
    instance.createUser = createUser.bind(instance);
    return instance;    
}

// Global Instance 
const axiosInstance = initAxiosInstance(DEBUG);


export default axiosInstance;
