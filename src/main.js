import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueRouter from 'vue-router'
import router from './router/index';


Vue.config.productionTip = false
Vue.use(VueRouter)
// Vue.use(Chart)
new Vue({
  // Chart,
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
