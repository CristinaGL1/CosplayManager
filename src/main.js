import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'; // Importa el router que creaste


createApp(App).use(router).mount('#app')