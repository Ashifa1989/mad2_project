import home from './components/home.js'
import profile from './components/profile.js'

const routes = [
    {path : '/', component : home},
    {path : '/profile', component : profile}
]

const router = new VueRouter({
    routes,
    base: '/'
})

const app = new Vue({
    el : "#app",
    router
})
