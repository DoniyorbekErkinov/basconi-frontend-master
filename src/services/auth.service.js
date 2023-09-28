import ApiService from './api.service'
import {TokenService} from './storage.service'
import store from "./store";

const REG_MAIN_API_URL = 'registration'
const USER_MAIN_API_URL = 'user'

class AuthenticationError extends Error {
    constructor(errorCode, message) {
        super(message)
        this.name = this.constructor.name
        this.message = message
        this.errorCode = errorCode
    }
}

const AuthService = {
    sendVerifyCodeToMail(payload) {
        return ApiService.post(`${REG_MAIN_API_URL}/send/confirmation/code/to-mail`, payload)
    },

    sendVerifyCodeToPhone(payload) {
        let payloadTemp = JSON.parse(JSON.stringify(payload))
        payloadTemp.user.phoneNumber = payloadTemp.user.phoneNumber.replaceAll('-', '')
        payloadTemp.user.phoneNumber = payloadTemp.user.phoneNumber.replaceAll('+', '')
        return ApiService.post(`${REG_MAIN_API_URL}/send/confirmation/code/to-phone`, payloadTemp)
        /*return new Promise(function(resolve) {
            setTimeout(resolve, 1000);
        });*/
    },

    checkNoUsername(username) {
        return ApiService.get(`${USER_MAIN_API_URL}/check/no-username?username=${username}`)
    },

    isOrgRegistered(inn) {
        return ApiService.get(`${REG_MAIN_API_URL}/check-inn?inn=${inn}`)
    },

    getKeyForLoginSign(inn) {
        return ApiService.get(`key-for-login-sign?inn=${inn}`)
    },
    /**
     * Login the user and store the access token to TokenService.
     *
     * @returns access_token
     * @throws AuthenticationError
     **/
    login: async function (user) {
        try {
            const response = await ApiService.post(`/api/v.1/auth-payload`, user, true)
            TokenService.removeToken();
            TokenService.removeLocale();
            TokenService.removeRefreshToken();
            TokenService.removeSidebar();
            ApiService.removeHeader();
            TokenService.removeUserInfo();
            TokenService.removeUserPerm()
            ApiService.unmount401Interceptor()
            TokenService.saveToken(response.data.token)
            TokenService.saveRefreshToken(response.data.token);
            TokenService.setUserInfo({
                id: response.data.id,
                username: response.data.username,
                department: response.data.department
            });
            TokenService.setUserPerm({
                permissions: response.data.roles.permissions,
                roles: response.data.roles.id
            })
            ApiService.setHeader();
            store.commit('ROOT_LOGIN_SUCCESS', response.data)
            ApiService.mount401Interceptor();
            return response.data;
        } catch (error) {
            throw new AuthenticationError(error.response.status, error.response.data.message)
        }
    },
    loginEsp: async function (signedData) {
        const requestData = {
            method: 'post',
            url: '/api/v.1/auth-payload',
            data: {
                signedData: signedData,
            },
            config: {
                withLoader: true
            }
        };

        try {
            const response = await ApiService.customRequest(requestData)
            TokenService.saveToken(response.data.token)
            TokenService.saveRefreshToken(response.data.token)
            TokenService.setUserInfo({
                id: response.data.id,
                username: response.data.username,
                settings: response.data.userSettings
            })
            TokenService.setLocale(response.data.userinfo.Lang);
            ApiService.setHeader();

            ApiService.mount401Interceptor();

            return response.data;
        } catch (error) {
            throw new AuthenticationError(error.response.status, error.response.data.detail)
        }
    },

    loginByToken(token) {
        TokenService.saveToken(token)
        ApiService.setHeader()

        ApiService.mount401Interceptor();

        return token
    },
    /**
     * Refresh the access token.
     **/
    refreshToken: async function () {
        const refreshToken = TokenService.getRefreshToken()

        const requestData = {
            method: 'post',
            url: "/o/token/",
            data: {
                grant_type: 'refresh_token',
                refresh_token: refreshToken
            },
            auth: {
                username: process.env.VUE_APP_CLIENT_ID,
                password: process.env.VUE_APP_CLIENT_SECRET
            },
            config: {
                withLoader: true
            }
        }

        try {
            const response = await ApiService.customRequest(requestData)

            TokenService.saveToken(response.data.access_token)
            TokenService.saveRefreshToken(response.data.refresh_token)
            // Update the header in ApiService
            ApiService.setHeader()

            return response.data.access_token
        } catch (error) {
            throw new AuthenticationError(error.response.status, error.response.data.detail)
        }

    },

    /**
     * Logout the current user by removing the token from storage.
     *
     * Will also remove `Authorization Bearer <token>` header from future requests.
     **/
    logout() {
        TokenService.removeToken();
        TokenService.removeLocale();
        TokenService.removeRefreshToken();
        TokenService.removeSidebar();
        ApiService.removeHeader();
        TokenService.removeUserInfo();
        TokenService.removeUserPerm()
        TokenService.removeCashboxId()
        TokenService.removeDepartmentId()
        store.commit('ROOT_LOGOUT_SUCCESS')
        ApiService.unmount401Interceptor()
    }
}

export default AuthService

export {AuthService, AuthenticationError}
