import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import './firebase' // si ya tienes tu config Firebase
import router from './router'; // Importa el router que creaste

const app = createApp(App);
app.use(router); // Usa el router en tu aplicación
app.mount('#app');