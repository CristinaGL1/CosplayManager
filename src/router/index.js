// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import LoginRegister from '../views/LoginRegister.vue';
import CosplayDetails from '../views/CosplayDetails.vue'; // Crea este componente
import Dashboard from '../views/Dashboard.vue'; // Importa el componente Dashboard
import CosplayLanding from '@/views/CosplayLanding.vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const routes = [
  { path: '/', component: LoginRegister },
  { path: '/cosplay/:id', component: CosplayDetails, props: true }, // :id será un parámetro
  { path: '/dashboard/:id', component: Dashboard, props: true }, // 
  { path: '/cosplaylanding', component: CosplayLanding },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});
router.beforeEach(async (to, from) => {
  const auth = getAuth();
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // Usuario logueado: siempre redirige a /cosplaylanding si intenta ir a '/' o ya está allí.
        if (to.path === '/') {
          resolve({ path: '/cosplaylanding' });
        } else {
          resolve(true); // Permite la navegación a otras rutas si está logueado
        }
      } else {
        // Usuario no logueado: siempre redirige a '/' (LoginRegister) si intenta ir a '/cosplaylanding' o '/dashboard/:id'.
        if (to.path === '/cosplaylanding' || to.path.startsWith('/dashboard/')) {
          resolve({ path: '/' });
        } else {
          resolve(true); // Permite la navegación a otras rutas si no está logueado (ej. la propia página de login)
        }
      }
    });
  });
});
export default router;