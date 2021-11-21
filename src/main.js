import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Buefy from 'buefy'
import '../src/assets/styles.scss';

import Home from './components/Home.vue'
import ScheduleMaker from './components/ScheduleMaker.vue'

Vue.config.productionTip = false

Vue.use(Buefy)
Vue.use(VueRouter)

const routes = [
  { name: 'home', path: '/', component: Home },
  { name: 'schedule', path: '/schedule', component: ScheduleMaker }
]

const router = new VueRouter({ mode: 'history', routes: routes});

// eslint-disable-next-line
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')