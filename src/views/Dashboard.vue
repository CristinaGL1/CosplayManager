<template>
  <div>
    <NavigationBar :userLogged="userLogged" @toggle-add-cosplay="showAddCosplay = !showAddCosplay" @logout-user="logout" />

    <div class="cosplay-area">
      <AddCosplay v-if="showAddCosplay" @cosplay-agregado="loadCosplays" @ocultar-formulario="showAddCosplay = false" />
      <CosplayList :cosplays="cosplayList" @cosplay-eliminado="handleCosplayEliminado" />
    </div>

    <div v-if="mensajeLogout" class="notification">{{ mensajeLogout }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import AddCosplay from '../components/addCosplay.vue';
import CosplayList from '../components/cosplayList.vue';
import NavigationBar from '../components/NavigationBar.vue';
import { getCosplays } from '../firestore';
import { useRouter } from 'vue-router';

const router = useRouter();
const cosplayList = ref([]);
const showAddCosplay = ref(false);
const userLogged = ref(false);
const mensajeLogout = ref('');
let cosplaysLoaded = false;

const loadCosplays = async () => {
  cosplayList.value = await getCosplays();
  cosplaysLoaded = true;
};

const logout = async () => {
  console.log('Función logout en Dashboard llamada');
  await signOut(getAuth());
  mensajeLogout.value = "Sesión cerrada";
  router.push('/'); // Redirigir al login
};

const handleCosplayEliminado = (id) => {
  cosplayList.value = cosplayList.value.filter(cosplay => cosplay.id !== id);
};

onMounted(() => {
  onAuthStateChanged(getAuth(), (user) => {
    userLogged.value = !!user;
    if (user) {
      loadCosplays();
    }
  });
});
</script>

<style scoped>
.cosplay-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 6rem;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.cosplay-area h2 {
  margin-bottom: 1rem;
}

.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 5px;
  z-index: 1000;
}
</style>

**Dónde añadirías `NavigationBar`:**

En cada vista donde quieras mostrar la barra de navegación (principalmente en las vistas donde el usuario está logueado, como `dashboard`, `gallery`, `cosplayDetails` si fuera necesario). En el ejemplo de arriba, ya la he añadido a `Dashboard.vue`.

¿Qué te parece esta refactorización inicial? Podemos seguir ajustando si tienes alguna otra idea.