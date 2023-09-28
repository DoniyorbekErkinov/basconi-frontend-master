import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)
import lt from './locales/lt.json'
import ru from './locales/ru.json'
import uz from './locales/uz.json'

let messages = {};
messages = { ...messages, lt, ru, uz}
// get current selected language
const lang = localStorage.getItem("locale") || "lt"

// Create VueI18n instance with options
const i18n = new VueI18n({
    locale: lang, // set locale
    fallbackLocale: 'uz',
    messages // set locale messages
});
  
export default i18n

