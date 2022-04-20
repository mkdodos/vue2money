import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueRouter from 'vue-router'

import Login from './components/Login';
import Stock from './components/Stock';
import StockTransaction from './components/StockTransaction';

import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyClLeHQJMt3BzbrK_AHpWeq0nlqzY2r5ik",
  authDomain: "money-39797.firebaseapp.com",
  projectId: "money-39797",
  storageBucket: "money-39797.appspot.com",
  messagingSenderId: "142963352306",
  appId: "1:142963352306:web:ac3c09e593009a5175666b",
  measurementId: "G-012VKYDZ07"
};


initializeApp(firebaseConfig);

import { getAuth } from "firebase/auth";



// console.log('main'+user)


Vue.config.productionTip = false

Vue.use(VueRouter)


const router = new VueRouter({
  mode: 'history',
  routes: [
    { name: 'Login', path: '/login', component: Login },
    {
      name: 'Stock', path: '/stock', component: Stock,
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
  const auth = getAuth();
  const user = auth.currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  // const currentUser = false
  if (requiresAuth && !user)
    next('/login')
  else if (requiresAuth && user)
    next()
  else
    next()
})

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
