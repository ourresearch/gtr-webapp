import Vue from 'vue'
import Router from 'vue-router'
import Serp from './views/Serp'
import Home from './views/Home'
import Welcome from './views/Welcome'
import EarlyAccess from './views/EarlyAccess'
import Paper from './views/Paper'
import Meta from 'vue-meta'


Vue.use(Router)
Vue.use(Meta)


export default new Router({
    mode: "history",
    routes: [
        {
            path: '/welcome',
            component: Welcome
        },
        {
            path: '/early-access',
            component: EarlyAccess
        },
        {
            path: '/',
            // redirect: "/search"
            component: Home
        },
        {
            path: '/paper/:namespace/:id',
            component: Paper
        },

        {
            path: '/search/:q',
            name: 'search',
            component: Serp,
            reloadOnSearch: false
        }
    ]
})
