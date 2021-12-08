import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Buefy from 'buefy'
import '../src/assets/styles.scss';

import Print from 'vue-print-nb'
Vue.use(Print);

import Home from './components/Home.vue'
import ScheduleMaker from './components/ScheduleMaker.vue'
import SuperIdol from './components/SuperIdol.vue'

Vue.config.productionTip = false

Vue.use(Buefy)
Vue.use(VueRouter)

const routes = [
  { name: 'home', path: '/', component: Home },
  { name: 'schedule', path: '/schedule', component: ScheduleMaker },
  { name: 'super', path: '/superidol', component: SuperIdol }
]

const router = new VueRouter({ mode: 'history', routes: routes});

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')