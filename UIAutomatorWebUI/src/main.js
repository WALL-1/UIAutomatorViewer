import Vue from 'vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import ResizableView from 'resizable-view'
import 'resizable-view/dist/resizable-view.css'


import api from './utils/api'

import App from './App.vue'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(ResizableView)

Vue.prototype.$api = api

new Vue({
  render: h => h(App),
}).$mount('#app')
