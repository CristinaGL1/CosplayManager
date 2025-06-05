// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import LoginRegister from '../views/LoginRegister.vue';
import CosplayDetails from '../views/CosplayDetails.vue'; // Crea este componente
import Dashboard from '../views/Dashboard.vue'; // Importa el componente Dashboard
import CosplayLanding from '@/views/CosplayLanding.vue';
import Kanban from '@/views/Kanban.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
  { path: '/', name: "LoginRegister", component: LoginRegister },
  // { path: '/cosplay/:id', component: CosplayDetails, props: true }, // :id será un parámetro
  // { path: '/dashboard/:id', component: Dashboard, props: true }, // 
  { path: '/cosplaylanding', component: CosplayLanding },
  { path: '/kanban', component: Kanban },
  ]
});

export default router;