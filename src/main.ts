import Vue from 'vue';
import App from './App.vue';
import router from './router';
import { DecklistStore, store } from './decklist-store';

Vue.config.productionTip = false;

Vue.prototype.$decks = new DecklistStore();

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
