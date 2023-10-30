import profile from './components/profile.js'
import login from './components/login.js'
import cart from './components/cart.js'
import home from './components/home.js'
import product from './components/product.js'

import all_category from './components/all_category.js'
import signUp from './components/signUp.js'
import all_product from './components/all_product.js'
import order from './components/order.js'
import logout from './components/logout.js'
import navbar from './components/navbar.js'
import address from './components/address.js'
import payment from './components/payment.js'

const routes = [
    {path : '/', component : home},
    {path : '/signUp', component : signUp},
    {path: '/profile', name: 'profile', component: profile },
    {path : '/login', component : login},
    {path : '/cart', name: 'Cart', component : cart, props : true},
    {path : '/search', component : home},
    {path : '/product/:id', component : product},
    {path : '/all_category', name:"all_category", component : all_category},
    {path : '/all_product', name:"all_product", component : all_product},
    {path : '/order/:id', component : order},
    {path : '/logout', component : logout},
    {path : '/navbar', component : navbar},
    {path : '/address', component : address},
    {path : '/payment', component : payment}
]

const router = new VueRouter({
    routes,
    base: '/'
})

const app = new Vue({
    el : "#app",
    router,
    components:{
        navbar
    }
    // methods: {
    //     async logout(){
    //         const res =await fetch("/logout")
    //         if(res.ok){
    //             this.$router.push("/login")
    //         }
    //         else{
    //             console.log("something went wrong. could not logout the user")
    //         }
    //     }
    // }
})
