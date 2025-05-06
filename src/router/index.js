// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import LoginRegister from '../components/LoginRegister.vue';
import CosplayDetails from '../components/CosplayDetails.vue'; // Crea este componente

const routes = [
  { path: '/', component: LoginRegister },
  { path: '/cosplay/:id', component: CosplayDetails, props: true }, // :id será un parámetro
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;