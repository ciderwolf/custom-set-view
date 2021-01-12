import Vue from 'vue';
import App from './App.vue';
import router from './router';
import DecklistStore from './decklist-store';

Vue.config.productionTip = false;

Vue.prototype.$store = new DecklistStore();

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
