import profile from './components/profile.js'
import login from './components/login.js'
import cart from './components/cart.js'
import home from './components/userDashboard.js'
import product from './components/product.js'

import all_category from './components/all_category.js'
import signUp from './components/signUp.js'
import all_product from './components/all_product.js'
import order from './components/order.js'
import logout from './components/logout.js'
import navbar from './components/navbar.js'
import address from './components/address.js'
import payment from './components/payment.js'
import signUpManager from './components/signUpManager.js'
import admin from './components/adminDashboard.js'


const routes = [
    { path: '/home', component: home },
    { path: '/signUp', component: signUp },
    { path: '/profile', name: 'profile', component: profile },
    { path: '/login', component: login },
    { path: '/cart', name: 'Cart', component: cart, props: true },
    // {path : '/search', component : home},
    { path: '/product/:id', component: product },
    { path: '/all_category', name: "all_category", component: all_category },
    { path: '/all_product', name: "all_product", component: all_product },
    { path: '/order/:id', component: order },
    { path: '/logout', component: logout },
    { path: '/navbar', component: navbar },
    { path: '/address', component: address },
    { path: '/payment', component: payment },
    { path: '/signUpManager', component: signUpManager },
    {path : '/adminDashboard', component : admin},
]

const router = new VueRouter({
    routes,
    base: '/'
})

const app = new Vue({
    el: "#app",
    router,
    // store,
    data: {
        isLoggedIn: false
    },
    components: {
        navbar,
        login,
        logout
    },
    
    methods: {
        userLoggedIn() {
            console.log("inside app.js userLoggedIn method");
            this.isLoggedIn = true;
        },
        userLoggedOut() {
            console.log("inside app.js userLoggedout method");
            this.isLoggedIn = false; // Update the prop value when the user logs out
            
        },
    },
    // async mounted() {
    //     this.isLoggedIn = localStorage.getItem('isLoggedIn');

    // },
    async mounted() {
        
        this.$root.$on('userLoggedInEvent', (roles) => {
            this.isLoggedIn = true;

            if (roles.some(r => r.name == 'Manager')) {
                this.isManager = true;
            }
            else {
                this.isManager = false;
            }
            if (roles.some(r => r.name == 'Admin')) {
                this.isAdmin = true;
            }
            else {
                this.isAdmin = false;
            }
        }),
        this.$root.$on('userLoggedOut', () => {
            this.isLoggedIn = false;
        }),

        this.isLoggedIn = localStorage.getItem('isLoggedIn');
        this.isLoggedIn = false;
        this.isAdmin = false;
        this.isManager = false;

        const textRoles = localStorage.getItem('roles');
        if (textRoles) {
            const roles = JSON.parse(textRoles)
            this.isLoggedIn = true;

            if (roles.some(r => r.name == 'Manager')) {
                this.isManager = true;
            }
            else {
                this.isManager = false;
            }
            if (roles.some(r => r.name == 'Admin')) {
                this.isAdmin = true;
            }
            else {
                this.isAdmin = false;
            }
        }
        
    }

})
