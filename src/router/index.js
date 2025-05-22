// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import LoginRegister from '../views/LoginRegister.vue';
import CosplayDetails from '../views/CosplayDetails.vue'; // Crea este componente
import Dashboard from '../views/Dashboard.vue'; // Importa el componente Dashboard

const routes = [
  { path: '/', component: LoginRegister },
  { path: '/cosplay/:id', component: CosplayDetails, props: true }, // :id será un parámetro
  { path: '/dashboard', component: Dashboard }, // Añade esta línea
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;