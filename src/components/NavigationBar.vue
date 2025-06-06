<template>
  <nav class="navbar">

    <div class="navbar-title">
      <img src="/src/icons/LogoIcon.png" alt="CosplayManagerLogo">
      <h1>CosplayManager</h1>
    </div>

    <div class="navbar-actions">
      <button @click="home" class="logout-icon">
        <img src="/src/icons/casa.svg" alt="Home" class="navbar-icon" />
      </button>
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

function home() {
  router.push('/cosplayLanding');
}
</script>

<style scoped>
.navbar {
  width: 100%;
  height: 4rem;
  background-color: var(--mainColor);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.7rem 1.25rem;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  border-bottom: 2px solid var(--secondaryColor);
}

.navbar-title {
  font-family: 'Pacifico', cursive;
  color: var(--secondaryColor);
  height: 100%;

  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.navbar-title img {
  height: 100%;
}

.navbar-title h1 {
  height: 100%;
  font-size: 1.75rem;

  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
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

.navbar-icon {
  width: 24px;
  height: 24px;
  /* Ya no necesitamos grayscale(100%) aquí para los iconos de logout */
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
  transition: filter 0.3s ease; /* Mantener la transición suave */

  /* *** MODIFICACIÓN PRINCIPAL AQUÍ: COLOREAR EL ICONO A secondaryColor *** */
  /* Este es un método más directo para teñir iconos negros a un color específico. */
  /* Asume que los iconos originales son NEGROS. */
  filter:
    invert(40%) /* Ajusta la luminosidad. Si tus iconos son muy oscuros, este valor te dará una base de gris */
    sepia(100%) /* Añade el tono cálido (amarillento-marrón) */
    saturate(150%) /* Aumenta la intensidad del color. Ajusta si quieres más o menos saturación */
    hue-rotate(230deg); /* Gira el tono para alcanzar el morado claro.
                        * Para `secondaryColor: #D1BEA8` (un morado/marrón cálido),
                        * un valor de 270deg-290deg debería funcionar.
                        * ¡Este valor es el que más necesitarás ajustar manualmente!
                        */
}

.logout-icon:hover {
  background-color: var(--secondaryColor); /* El fondo del botón al hacer hover */
}


</style>