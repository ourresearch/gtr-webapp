import Vue from 'vue'
import Router from 'vue-router'
import Serp from './views/Serp'
import Home from './views/Home'

Vue.use(Router)



export default new Router({
  mode: "history",
  routes: [
    {
      path: '/',
      // redirect: "/search"
      component: Home
    },

    {
      path: '/search/:q',
      component: Serp
    }
  ]
})
