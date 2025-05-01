<template>
  <div id="app">
    <h1>Cosplay Manager 👗</h1>
    <LoginRegister /> 
    <div v-if="!user">
      <p>Debes iniciar sesión para agregar nuevos cosplays.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

import LoginRegister from './components/LoginRegister.vue'

const user = ref(null)


// Detectar si hay sesión al cargar la app
onMounted(() => {
  const auth = getAuth()
  onAuthStateChanged(auth, (u) => {
    user.value = u
  })
})
</script>
