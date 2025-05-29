<template>
  <nav class="navbar">
    <div class="navbar-title">CosplayManager</div>
    <div class="navbar-actions" v-if="userLogged">
      <button @click="emit('toggle-add-cosplay')" class="add-cosplay-icon-button" title="Agregar Cosplay">
        <img src="/src/icons/agregarCosplay.svg" alt="Agregar Cosplay" class="navbar-icon" />
      </button>
      <button @click="handleLogout" class="logout-icon">
        <img src="/src/icons/salida.svg" alt="Cerrar sesión" class="navbar-icon" />
      </button>
    </div>
    <button v-else @click="handleLogout" class="logout-icon hidden" title="Cerrar sesión">
      <img src="/src/icons/salida.svg" alt="Cerrar sesión" class="navbar-icon" />
    </button>
  </nav>
</template>

<script setup>
const props = defineProps({
  userLogged: Boolean
});

const emit = defineEmits(['toggle-add-cosplay', 'logout-user']);

const handleLogout = () => {
  emit('logout-user');
  console.log('Logout emitido desde NavigationBar');
};
</script>

<style scoped>
.navbar {
  width: 100%;
  background-color: var(--mainColor);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.7rem 2rem;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  border-bottom: 2px solid var(--secondaryColor);
}

.navbar-title {
  font-family: 'Pacifico', cursive;
  font-size: 1.8em;
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