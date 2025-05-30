import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import './firebase' // si ya tienes tu config Firebase
import router from './router'; // Importa el router que creaste
import { getAuth, onAuthStateChanged } from 'firebase/auth';

let appInstance;

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (!appInstance) {
    appInstance = createApp(App);
    appInstance.use(router);
    appInstance.mount('#app');
  } else {
    // Esto se ejecuta en cambios de estado posteriores
    if (user && router.currentRoute.value.path === '/') {
      router.push('/cosplaylanding');
    } else if (!user && router.currentRoute.value.path !== '/') {
      router.push('/');
    }
  }
});