import home from './components/home.js'
import profile from './components/profile.js'
import login from './components/login.js'
import cart from './components/cart.js'
import search from './components/search.js'
import product from './components/product.js'
import category from './components/category.js'
const routes = [
    {path : '/', component : home},
    { path: '/profile/:id', name: 'profile', component: profile },
    {path : '/login1', component : login},
    {path : '/cart/user/:id', component : cart},
    {path : '/search', component : search},
    {path : '/product/category/:category_name', component : product},
    {path : '/category', component : category}
]

const router = new VueRouter({
    routes,
    base: '/'
})

const app = new Vue({
    el : "#app",
    router
})
