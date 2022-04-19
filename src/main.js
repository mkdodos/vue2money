import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueRouter from 'vue-router'

import Login from './components/Login';
import Stock from './components/Stock';
import StockTransaction from './components/StockTransaction';


Vue.config.productionTip = false

Vue.use(VueRouter)


const router = new VueRouter({
  mode: 'history',
  routes: [
    { name: 'Login', path: '/login', component: Login },
    { name: 'Stock', path: '/stock', component: Stock,
    // meta: { requiresAuth: true }
   },
    { name: 'StockTransaction', path: '/stock-transaction/:id', component: StockTransaction },
    {
      name: 'StockTransactionAll', path: '/stock-transaction',
      meta: { requiresAuth: true }
      , component: StockTransaction
    },

  ]
})

router.beforeEach((to, from, next) => {
  // 路由中有包含此值,就導向登入頁
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth)
    next('/login')
  else
    next()
})

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
