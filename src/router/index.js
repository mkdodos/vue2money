import VueRouter from 'vue-router'
import Login from '../components/Login';
import Stock from '../components/Stock';
import Spend from '../components/Spend';
import SpendCate from '../components/SpendCate';
import SpendTab from '../components/SpendTab';
import Score from '../components/Score';
import StockTransaction from '../components/StockTransaction';

import '../firebase/init';

import { getAuth } from "firebase/auth";

const router = new VueRouter({
    mode: 'history',
    routes: [
        { name: 'Score', path: '/score', component: Score },
        { name: 'SpendCate', path: '/spend/cate', component: SpendCate },
        { name: 'Spend', path: '/spend', component: Spend },
        { name: 'SpendTab', path: '/spend-tab', component: SpendTab },
        { name: 'Login', path: '/login', component: Login },
        { name: 'Stock', path: '/stock', component: Stock },
        { name: 'StockTransaction', path: '/stock-transaction/:id', component: StockTransaction },
        {
            name: 'StockTransactionAll',
            path: '/stock-transaction',
            meta: { requiresAuth: true },
            component: StockTransaction
        }
    ]
})

router.beforeEach((to, from, next) => {
    // 路由中有包含此值,就導向登入頁
    const auth = getAuth();
    const user = auth.currentUser;
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)    
    if (requiresAuth && !user)
        next('/login')
    else if (requiresAuth && user)
        next()
    else
        next()
})

export default router;