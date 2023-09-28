import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// import NProgress from "nprogress";
import {TokenService} from "../services/storage.service";
import {LoadingBar} from "quasar";
// NProgress.configure({ showSpinner: true });

// router.beforeResolve((to, from, next) => {
//   // If this isn't an initial page load.
//   if (to.name) {
//     // Start the route progress bar.
//     // NProgress.start(800);
//     LoadingBar.setDefaults({
//       color: 'green',
//       size: '2px',
//       position: 'top'
//     })
//     LoadingBar.start()
//   }
//   const isPublic = to.matched.some(record => record.meta.public)
//   const onlyWhenLoggedOut = to.matched.some(record => record.meta.onlyWhenLoggedOut)
//   const loggedIn = !!TokenService.getToken();
//   // CHECK IF USER HAS PERMISSION FOR THIS URL
//   const isOpen = ('hasPerm' in to.meta) ? !!to.meta.hasPerm() : true;

//   if (!isPublic && !loggedIn && to.name !== '/authentication/fullregister') {
//     return next({
//       path: '/login',
//       query: { redirect: to.fullPath === '/login' ? '/' : to.fullPath }  // Store the full path to redirect the user to after login
//     });
//   }
//   if (!isOpen) {
//     return next('/');
//   }
//   // Do not allow user to visit login page or register page if they are logged in
//   if (loggedIn && onlyWhenLoggedOut) {
//     return next('/')
//   }
//   next();
// });

router.afterEach(() => {
  // Complete the animation of the route progress bar.
  // NProgress.done();
  LoadingBar
});
export default router
