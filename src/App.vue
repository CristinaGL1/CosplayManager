<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script setup>
// No necesitamos importar LoginRegister aquí si lo estamos manejando por rutas
import { ref, onMounted } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const user = ref(null);

onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (u) => {
    user.value = u;
  });
});
</script>