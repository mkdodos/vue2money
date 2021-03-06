import VueRouter from 'vue-router';
import Login from '../components/Login';
import Stock from '../components/Stock';
import Spend from '../components/Spend';
import Account from '../components/Account';
import Cate from '../components/Cate';
import Balance from '../views/Balance';
import Expense from '../components/Expense';
import ExpenseDetail from '../components/ExpenseDetail';
import ExpenseGas from '../components/ExpenseGas';
import ExpenseDada from '../components/ExpenseDada';
import ExpenseTab from '../components/ExpenseTab';
import SpendCate from '../components/SpendCate';
import SpendTab from '../components/SpendTab';
import CashIn from '../components/CashIn';
import Score from '../components/Score';
import StockTransaction from '../components/StockTransaction';
import Home from '../components/Home.vue';
// import Toolbar from '../components/Toolbar.vue';

import '../firebase/init';

// import { getAuth } from 'firebase/auth';

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/home',
      component: Home,
    },
    { name: 'Score', path: '/score', component: Score },
    { name: 'SpendCate', path: '/spend/cate', component: SpendCate },
    { name: 'Spend', path: '/spend', component: Spend },
    { name: 'Account', path: '/account', component: Account },
    { name: 'Cate', path: '/cate', component: Cate },
    { name: 'Balance', path: '/views/balance', component: Balance },
    { name: 'Expense', path: '/expense', component: Expense },
    {
      name: 'ExpenseDetail',
      path: '/expense/detail',
      component: ExpenseDetail,
      
    },
    { name: 'ExpenseGas', path: '/expense/gas', component: ExpenseGas },
    { name: 'ExpenseDada', path: '/expense/dada', component: ExpenseDada },
    { name: 'ExpenseTab', path: '/expense-tab', component: ExpenseTab ,
    meta: { requiresAuth: true },
  
  },
    { name: 'SpendTab', path: '/spend-tab', component: SpendTab },
    { name: 'CashIn', path: '/cash-in', component: CashIn },
    { name: 'Login', path: '/login', component: Login },
    { name: 'Stock', path: '/stock', component: Stock },
    {
      name: 'StockTransaction',
      path: '/stock-transaction/:id',
      component: StockTransaction,
    },
    {
      name: 'StockTransactionAll',
      path: '/stock-transaction',
      meta: { requiresAuth: true },
      component: StockTransaction,
    },
  ],
});


import { getAuth } from 'firebase/auth';

  router.beforeEach((to, from, next)=>{
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const user = getAuth().currentUser;
    if(requiresAuth && !user){
      next('/login')
    }else{
      next()
    }
  })
  // ????????????????????????,??????????????????
  // const auth = getAuth();
  // const user = auth.currentUser;
  
  


export default router;
