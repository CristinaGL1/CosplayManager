<template>
  <nav class="navbar">

    <div class="navbar-title">CosplayManager</div>

    <div class="navbar-actions">
      <button @click="logout" class="logout-icon">
        <img src="/src/icons/salida.svg" alt="Cerrar sesión" class="navbar-icon" />
      </button>
    </div>
  </nav>

</template>

<script setup>
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie'

const router = useRouter();

//Funcion para borrar el Local Storage y salir al login
function logout() {
  Cookies.remove('userID');
  localStorage.clear();
  console.log('Todo el Local Storage ha sido limpiado para este origen.');
  router.push('/');
}
</script>

<style scoped>
.navbar {
  width: 100%;
  background-color: var(--secondaryColor);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.7rem 2rem;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  border-bottom: 2px solid var(--mainColor);
}

.navbar-title {
  font-family: 'Pacifico', cursive;
  font-size: 1.8em;
  color: var(--mainColor);
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.add-cosplay-icon-button,
.logout-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.2rem;
  border-radius: 5px;
}

.add-cosplay-icon-button:hover,
.logout-icon:hover {
  background-color: #e0f7fa;
}

.navbar-icon {
  width: 24px;
  height: 24px;
  filter: grayscale(100%);
}

.hidden {
  visibility: hidden;
}

.logout-icon img.navbar-icon {
  width: 22px;
  height: 22px;
}

.logout-icon img {
  width: 20px;
  height: 20px;
  filter: brightness(0);
  transition: filter 0.3s ease;
}

.logout-icon:hover {
  background-color: #f7ecf2;
}
</style>