import Vue from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import Vuesax from 'vuesax'
import Quasar from "quasar";
import "./plugins/vee-validate";
import 'vuesax/dist/vuesax.css'
import 'quasar/dist/quasar.css'
import '@mdi/font/css/materialdesignicons.css'
import 'material-icons/iconfont/material-icons.css';
import './assets/main.css'
import ApiService from "./services/api.service";
import {TokenService} from "./services/storage.service";

Vue.use(Vuesax)
Vue.use(Quasar)
Vue.config.productionTip = false

ApiService.init(process.env.VUE_APP_ROOT_API);

if (TokenService.getToken()) {
  ApiService.setHeader();
  ApiService.mount401Interceptor();
} else {
  AuthService.logout();
}

import VueMask from 'v-mask'
Vue.use(VueMask)

import moment from 'moment'
Vue.use(moment)
/*
 * FOR USER PERMISSIONS MANAGEMENT ON UI */
import { abilitiesPlugin, Can } from "@casl/vue";
import { ability } from './services/ability'
Vue.use(abilitiesPlugin, ability);
Vue.component("Can", Can);

import Vuex from 'vuex'
import AuthService from "./services/auth.service";
import './registerServiceWorker'
Vue.use(Vuex)

ApiService.mount401Interceptor()

router.beforeEach((to, from, next) => {
  let lang = localStorage.getItem('locale')
  if (!lang) {
    i18n.locale = 'lt'
    TokenService.setLocale('lt')
  } else {
    i18n.locale = lang
  }
  next()
})

new Vue({
  router,
  i18n,
  render: function (h) { return h(App) }
}).$mount('#app')
