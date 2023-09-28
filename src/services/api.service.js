import axios from "axios";
import {TokenService} from "./storage.service";
import AuthService from "./auth.service";
import {Loading, Notify} from 'quasar';

// FUNCTION FOR CHECKING IF STRING IS JSON PARSABLE
import router from "@/router/index"
function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

const ApiService = {
    // Stores the 401 interceptor position so that it can be later ejected when needed
    _401interceptor: null,
    _requestInterceptor: null,

    init(baseURL) {
        axios.defaults.baseURL = baseURL;
    },

    setHeader() {
        axios.defaults.headers.common[
            "Authorization"
            ] = `Bearer ${TokenService.getToken()}`;
    },

    removeHeader() {
        axios.defaults.headers.common = {};
    },

    get(resource, withLoader) {
        return axios.get(resource, {withLoader: withLoader});
    },

    post(resource, data, withLoader = false) {
        return axios.post(resource, data, {withLoader: withLoader});
    },
    postFile(resource, data, withLoader = false) {
        return axios.post(resource, data, {
            responseType: "blob",
            withLoader: withLoader
        });
    },
    getFile(resource, withLoader = false) {
        return axios.get(resource, {
            responseType: "blob",
            withLoader: withLoader
        });
    },
    formDataFile(resource, data, withLoader = false) {
        return axios.post(resource, data, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            withLoader: withLoader
        });
    },

    put(resource, data, withLoader = false) {
        return axios.put(resource, data, {withLoader: withLoader});
    },

    delete(resource, withLoader = false) {
        return axios.delete(resource, {withLoader: withLoader});
    },

    /**
     * Perform a custom axios request.
     *
     * data is an object containing the following properties:
     *  - method
     *  - url
     *  - data ... request payload
     *  - auth (optional)
     *    - username
     *    - password
     **/
    customRequest(data) {
        return axios(data);
    },

    mount401Interceptor() {
        let requestCount = 0
        const messages = []
        this._401interceptor = axios.interceptors.response.use(
            (response) => {
                if (requestCount > 0)
                    /* DECREMENT REQUEST COUNT */
                    requestCount--
                /* GLOBAL LOADING OVERLAY PART */
                if (requestCount === 0) {
                    // store.commit('SET_GLOBAL_LOADING', false)
                    Loading.hide()
                }
                return response
            },
            async (error) => {


                if (requestCount > 0)
                    /* DECREMENT REQUEST COUNT */
                    requestCount--
                /* GLOBAL LOADING OVERLAY AND
                 SHOWING ERROR MESSAGES PART */
                /* SHOW MESSAGES */
                if (requestCount === 0) {
                    Loading.hide()
                    Notify.create({
                        message: JSON.parse(error.request.response).message,
                        position: 'top-right',
                        type: 'negative',
                        multiLine: true,
                        progress: true,
                        timeout: 1000
                    })
                    // this.$vs.notification({
                    //     title: JSON.parse(error.request.response).message,
                    //     progress: 'auto',
                    //     duration: 1000,
                    //     color: 'danger',
                    //     position: 'top-right'
                    // })
                }
                /* ------------------------------------------- */
                if (error.request) {
                    if (error.request.status === 401) {
                        AuthService.logout()
                        router.push('/login')
                    }
                }
                // If error was not 401 just reject as is
                throw error
            }
        )
        this._requestInterceptor = axios.interceptors.request.use(function (config) {
            /* GLOBAL LOADING OVERLAY PART */
            Loading.show({spinnerColor: 'blue'})
            /* INCREMENT REQUEST COUNT */
            requestCount++

            return config
        }, function (error) {
            if (requestCount > 0)
                /* DECREMENT REQUEST COUNT */
                requestCount--
            return Promise.reject(error)
        })
    },
    unmount401Interceptor() {
        // Eject the interceptor
        axios.interceptors.response.eject(this._401interceptor)
        axios.interceptors.request.eject(this._requestInterceptor)
    }
};

export default ApiService;
