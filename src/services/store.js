import Vue from 'vue'
import Vuex from 'vuex'
import storage from "./storage";
import {abilityPlugin, ability as appAbility} from './ability'
import {TokenService} from "./storage.service";

Vue.use(Vuex);

const store = new Vuex.Store({
    plugins: [
        storage({
            storedKeys: ['token', 'rules'],
            destroyOn: ['logoutSuccess']
        }),
        abilityPlugin
    ],
    state: {
        rules: [],
        user: {
            permissions: []
        },
        userId: null,
        token: TokenService.getToken()
    },
    mutations: {
        ROOT_LOGIN_SUCCESS(state, user) {
            let formattedRules = [];
            if (user.roles.permissions.length > 0) {
                formattedRules = user.roles.permissions.map(perm => {
                    let formattedObj = {};
                    formattedObj.action = perm.substr(0, perm.indexOf(' '));
                    formattedObj.subject = perm.substr(perm.indexOf(' ') + 1);
                    return formattedObj;
                })
            }
            state.rules = formattedRules;
            state.user = user;
            state.userId = user.id;
            state.token = user.token;
        },
        ROOT_LOGOUT_SUCCESS(state) {
            state.token = '';
            state.rules = [];
            state.userId = null;
        }
    }
})

export default store
