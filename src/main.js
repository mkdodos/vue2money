import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueRouter from 'vue-router'

// import Home from './components/HelloWorld';
import Stock from './components/Stock';
import StockTransaction from './components/StockTransaction';

Vue.config.productionTip = false

Vue.use(VueRouter)


const router = new VueRouter({
  routes: [
    
    { name:'Stock', path:'/stock', component:Stock },
    { name:'StockTransaction', path:'/stock-transaction/:id', component:StockTransaction },
  ]
})

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
