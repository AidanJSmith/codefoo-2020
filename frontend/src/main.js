import Vue from 'vue'
import App from './App.vue'
import { ReactiveRefs } from 'vue-reactive-refs'

Vue.use(ReactiveRefs)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
