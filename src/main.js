import Vue from 'vue'
import axios from './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import { firestorePlugin } from 'vuefire'
import VueSocketio from 'vue-socket.io';
import socketio from 'socket.io-client';

// Vue.use(new VueSocketio({
//   debug: true,
//   connection: 'ws://127.0.0.1:55688' //address here
// }));

Vue.config.productionTip = false
Vue.use(firestorePlugin)
Vue.use(axios)

// axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
// axios.defaults.headers.post['Access-Control-Allow-Headers'] = 'X-Requested-With,Content-Type';
// axios.defaults.headers.post['Access-Control-Allow-Method'] = 'PUT,POST,GET,DELETE,OPTIONS';

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

// router.beforeEach((to, from, next) => {
//   store.state.logintoken != "" ? next() : next('/Home')
// })

