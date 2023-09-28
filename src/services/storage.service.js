const TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_INFO = 'user_info';
const USER_LOCALE = 'locale';
const SIDEBAR = 'sidebar';
const SELECTED_MODULE = 'selected_module'
const USER_PERM = 'user_permissions'
const USER_ID = 'user_id';
const DEPARTMENT_TYPE = 'dep_type'
const CASHBOX_ID = 'cashboxId'
const CASHBOX_NAME = 'cashbox_name'
const DEPARTMENT_ID = 'dep_id'
const DEPARTMENT_NAME = 'dep_name'

/**
 * Manage the how Access Tokens are being stored and retreived from storage.
 *
 * Current implementation stores to localStorage. Local Storage should always be
 * accessed through this instace.
 **/
const TokenService = {
    getSelectedModule() {
        return localStorage.getItem(SELECTED_MODULE)
    },
    setSelectedModule(moduleName) {
        localStorage.setItem(SELECTED_MODULE, moduleName)
    },
    getToken() {
        return localStorage.getItem(TOKEN_KEY)
    },
    getLocale() {
        if (localStorage.getItem(USER_LOCALE) && localStorage.getItem(USER_LOCALE) !== 'undefined') {
            return localStorage.getItem(USER_LOCALE)
        } else {
            return 'lt'
        }
    },
    setLocale(lang) {
        localStorage.setItem(USER_LOCALE, lang)
    },
    setSidebar(data) {
        localStorage.setItem(SIDEBAR, JSON.stringify(data))
    },
    getSidebar() {
        if (localStorage.getItem(SIDEBAR)) {
            return JSON.parse(localStorage.getItem(SIDEBAR))
        } else {
            return []
        }
    },
    getUserId() {
        return localStorage.getItem(USER_ID)
    },
    removeUserId() {
        localStorage.removeItem(USER_ID)
    },
    removeSidebar() {
        localStorage.removeItem(SIDEBAR)
    },
    saveToken(accessToken) {
        localStorage.setItem(TOKEN_KEY, accessToken)
    },

    removeToken() {
        localStorage.removeItem(TOKEN_KEY)
    },
    removeLocale() {
        localStorage.removeItem(USER_LOCALE)
    },

    getRefreshToken() {
        return localStorage.getItem(REFRESH_TOKEN_KEY)
    },

    saveRefreshToken(refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    },

    removeRefreshToken() {
        localStorage.removeItem(REFRESH_TOKEN_KEY)
    },
    setUserInfo(data) {
        localStorage.setItem(USER_INFO, JSON.stringify(data))
    },
    setUserId(data) {
        localStorage.setItem(USER_ID, data)
    },
    getUserInfo() {
        return JSON.parse(localStorage.getItem(USER_INFO))
    },
    removeUserInfo() {
        localStorage.removeItem(USER_INFO)
    },
    setUserPerm(data) {
        localStorage.setItem(USER_PERM, JSON.stringify(data))
    },
    getUserPerm() {
        return JSON.parse(localStorage.getItem(USER_PERM))
    },
    removeUserPerm() {
        localStorage.removeItem(USER_PERM)
    },
    getRoles() {
        let obj = JSON.parse(localStorage.getItem('state'));
        return obj.roles
    },
    getSidebarHorizontal() {
        return localStorage.getItem(SIDEBAR)
    },
    setSidebarHorizontal(sidebar) {
        localStorage.setItem(SIDEBAR, sidebar)
    },

    //  CashBox
    removeCurrentUserId() {
        localStorage.removeItem(USER_ID_KEY);
    },
    removeCashboxId() {
        localStorage.removeItem(CASHBOX_ID);
    },
    saveCashBoxId(id) {
        localStorage.setItem(CASHBOX_ID, id );
    },
    getCashBoxId() {
        return JSON.parse(localStorage.getItem(CASHBOX_ID));
    },
    getDepartmentId() {
        return localStorage.getItem(DEPARTMENT_ID)
    },
    removeDepartmentId() {
        localStorage.removeItem(DEPARTMENT_ID);
    },
    setDepartmentId(id) {
        return localStorage.setItem(DEPARTMENT_ID, id)
    },
}

export {TokenService}
