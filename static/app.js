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
// import store from './store/store.js'

const routes = [
    {path : '/home', component : home},
    {path : '/signUp', component : signUp},
    {path: '/profile', name: 'profile', component: profile },
    {path : '/login', component : login},
    {path : '/cart', name: 'Cart', component : cart, props : true},
    // {path : '/search', component : home},
    {path : '/product/:id', component : product},
    {path : '/all_category', name:"all_category", component : all_category},
    {path : '/all_product', name:"all_product", component : all_product},
    {path : '/order/:id', component : order},
    {path : '/logout', component : logout},
    {path : '/navbar', component : navbar},
    {path : '/address', component : address},
    {path : '/payment', component : payment},
    {path : '/signUpManager', component : signUpManager},
    // {path : '/store', component : store},
]

const router = new VueRouter({
    routes,
    base: '/'
})

const app = new Vue({
    el : "#app",
    router,
    // store,
    data:{
        isLoggedIn:false
    },
    components:{
        // navbar,
        login,
        logout        
    },
    template: `
            <div>
                <div class="container-flex">
                <nav class="navbar navbar-expand-lg navbar-light bg-success">
                    <div class="logo-container leaf"></div>
                    <div class="navbar-brand" href="#">
                    <h2 style="color: rgb(0, 3, 3); margin-left: 5px;">Leaf Grocery Shop</h2>
                    </div>
                <div class="container-flex">
                <div class="navbar" id="navbarNavAltMarkup">
                    <login :isLoggedIn="isLoggedIn" @userLoggedInEvent="userLoggedIn" />
                    <div class="navbar-nav" v-if="isLoggedIn">
                    <router-link to="/logout" class="nav-link" style="margin-left: 20px; margin-right: 20px; float: right;">Logout</router-link>
                    <router-link to="/cart" class= "nav-link" style="margin-left: 20px; float: right;">Cart</router-link>
                            <router-link to="/all_product" class="nav-link" style="margin-left: 20px; float: right;">Products Management</router-link>
                    <router-link to="/all_category" class="nav-link" style="margin-left: 20px; float: right;">Category Management</router-link>
                    <router-link to="/search" class="nav-link" style="margin-left: 20px; float: right;">Product</router-link>
                    </div>
                    <logout :isLoggedIn="isLoggedIn" @userLoggedOut="userLoggedOut" />
                    <div class="navbar-nav" v-if="!isLoggedIn">
                    <router-link to="/login" class="nav-link" style="margin-left: 20px; margin-right: 20px; float: right;">Login</router-link>
                    <router-link to="/signup" class="nav-link" style="margin-left: 20px; float: right;">Signup</router-link>
                    <router-link to="/signupManager" class="nav-link" style="margin-left: 20px; float: right;">signupManager</router-link>
                    </div>
                </div>
                </div>
            </nav>
            <div class="container">
                <router-view></router-view>
            </div>
            </div>
            
        </div>
`,


    // computed: {
    //     isLoggedIn() {
    //       return this.$store.state.isLoggedIn;
    //     },
    //   },
      methods: {
            userLoggedIn() {
              console.log("inside app.js userLoggedIn method");
              this.isLoggedIn = true;
            },
          userLoggedOut() {
            console.log("inside app.js userLoggedout method");
            this.isLoggedIn = false; // Update the prop value when the user logs out
          },
    }
    
})
