
// from https://github.com/vuetifyjs/vue-cli-plugin-vuetify/issues/3
import '@babel/polyfill'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import VueScrollTo from 'vue-scrollto'
import VueAnalytics from 'vue-analytics'
import VueMoment from 'vue-moment'
import VueTyperPlugin from 'vue-typer'

Vue.use(VueMaterial)
Vue.use(VueScrollTo)
Vue.use(VueAnalytics, {
  id: "UA-23384030-8",
  router
})
Vue.use(VueMoment);
Vue.use(VueTyperPlugin)




Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
