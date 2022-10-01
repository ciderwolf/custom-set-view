import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { initDeckStore } from './stores/decks'

const app = createApp(App)

app.use(createPinia())
initDeckStore();

app.use(router)

app.mount('#app')
