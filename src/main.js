import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueRouter from 'vue-router'
import router from './router/index';
// import routerGuard from './router/guard';
// import { routes } from './router/guard';
// import { routes } from './routes' //路由規則


import store from './vuex';

Vue.config.productionTip = false
Vue.use(VueRouter)

// const routerGuard = new VueRouter({
//   routes,
//   mode: 'history'
// });


// Vue.use(Chart)
new Vue({
  // Chart,
  vuetify,
  router,
  store,
  // routerGuard,
  // routerGuard,
  render: h => h(App)
}).$mount('#app')
