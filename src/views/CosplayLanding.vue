<template>

  <NavigationBar />
  <div class="cl">

    <lateralNav />

    <section class="cosplayGrid">

      <!--
      -------------------------------------------------
      --------------- NEW COSPLAY CARD ----------------
      ------------------------------------------------- 
      -->

      <div class="new-cosplay-item">
        <div class="new-cosplay-container" @click="showAddCosplay = true">
          <div class="plus-icon">+</div>
        </div>
        <div class="new-cosplay-text">Nuevo Cosplay</div>
      </div>

      <!--
      -------------------------------------------------
      ----------------- COSPLAY CARD ------------------
      ------------------------------------------------- 
      -->

      <div v-for="cosplay in cosplays" :key="cosplay.id" class="cosplay-item" @click="openModal(cosplay.id)">
        <div class="cosplay-thumbnail">
          <img v-if="cosplay.imagenURL" :src="'backend' + cosplay.imagenURL" alt="Imagen del cosplay"
            class="thumbnail-image">
          <div v-else class="no-image">Sin imagen</div>
        </div>
        <div class="cosplay-name">{{ cosplay.nombre }}</div>
      </div>
    </section>

    <div class="cosplay-area">
      <AddCosplay v-if="showAddCosplay" @cosplay-agregado="refetchCosplays"
        @ocultar-formulario="showAddCosplay = false" />
    </div>

    <div v-if="showDetailsModal" class="details-modal-overlay">
      <CosplayDetails :id="selectedCosplayIdForDetails" @close="showDetailsModal = false" />
    </div>

  </div>

  <CosplayOptionsModal
  v-if="showOptionsModal"
  :cosplayId="selectedCosplayIdForModal"
  @close="showOptionsModal = false"
  @view-dashboard="goToDashboard"
  @view-details="goToDetails"
/>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

import NavigationBar from '../components/NavigationBar.vue';
import lateralNav from '../components/lateralNav.vue';
import AddCosplay from '../components/addCosplay.vue';
import CosplayOptionsModal from '../components/CosplayOptionsModal.vue';
import CosplayDetails from '../views/CosplayDetails.vue';
import Cookies from 'js-cookie'

const route = useRoute();
const router = useRouter();
const localUserId = ref(route.query.userId);
const showAddCosplay = ref(false);
const showOptionsModal = ref(false);
const selectedCosplayIdForModal = ref(null);
const showDetailsModal = ref(false);
const selectedCosplayIdForDetails = ref(null);

const cosplays = ref([]);
const loggedInUserId = Cookies.get('userID');


// Recupera los cosplays para la lista
onMounted(async () => {
  if (loggedInUserId) {
    try {
      const response = await axios.get(`http://localhost:3000/cosplayList?userId=${Cookies.get('userID')}`);
      cosplays.value = response.data;
    } catch (error) {
      console.error('Error al cargar los cosplays del usuario:', error);
      // Manejar el error
    }
  } else {
    console.log('Usuario no logueado, no se pueden cargar los cosplays.');
    // Opcional: Redirigir al login
  }
});

const openModal = (id) => {
  selectedCosplayIdForModal.value = id;
  showOptionsModal.value = true;
  localStorage.setItem('selectedCosplay', id);
  console.log(localStorage.selectedCosplay)
};

const goToDashboard = (id) => {
  showOptionsModal.value = false;
  router.push(`/dashboard/${id}?userId=${localUserId.value}`);
};

const goToDetails = (id) => {
  showOptionsModal.value = false;
  selectedCosplayIdForDetails.value = id;
  showDetailsModal.value = true;
};


</script>

<style scoped>
#app {
  height: 100%;
  width: 100%;
}

.cl {
  height: 100%;
  width: 100%;
  display: flex;
  padding-top: 60px;
  box-sizing: border-box;
}

.gridScroll {
  width: 10vw;
  background-color: var(--mainColor);
  border-right: 2px solid var(--secondaryColor);
}

.cosplay-main-area {
  display: flex;
  width: 80vw;
  /* El ancho restante */
}

.cosplay-area{
  background-color: var(--mainColor);
}

.cosplayGrid {
  width: 80vw;
  padding: 30px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 220px);
  /* Forzamos el ancho de las columnas */
  gap: 25px;
  background-color: transparent;
  overflow-y: auto;
  justify-content: center;
  /* Centramos los elementos horizontalmente */
  align-items: start;
  /* Volvemos a alinear al inicio para los items */
  flex-grow: 1;
  /* Ocupa el espacio disponible */
}

/* Estilos para la tarjeta de detalles */
.cosplay-details-card {
  width: 400px;
  /* Ancho de la tarjeta */
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
  margin-left: 20px;
  /* Espacio entre la grid y la tarjeta */
}

.cosplay-item {
  display: flex;
  flex-direction: column;
  /* Colocamos el thumbnail encima del nombre */
  align-items: center;
  /* Centramos el thumbnail horizontalmente */
  cursor: pointer;
}

.new-cosplay-container,
.cosplay-thumbnail {
  width: 220px;
  height: 220px;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  text-align: center;
  border: 1px solid #ccc;
  /* Añadimos un borde gris claro */

}

.cosplay-thumbnail {

  color: white;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  /* Importante para que la imagen no se salga */
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* Hace que la imagen cubra el contenedor */
  border-radius: 20px;
  /* Para que coincida con el borde del cuadrado */
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  color: #888;
  border-radius: 20px;
}

.new-cosplay-container {
  border: 2px dashed #888;
  color: #555;
  font-size: 1em;
  flex-direction: column;
}

.cosplay-name {
  margin-top: 5px;
  text-align: center;
  color: #333;
  font-size: 1.1em;
  font-weight: bold;
}

.plus-icon {
  font-size: 5em;
  margin-bottom: 5px;
}

.new-cosplay-text {
  margin-top: 5px;
  font-size: 1.1em;
  font-weight: bold;
  color: #333;

}

.details-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  /* Fondo oscuro semitransparente */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1010;
  /* Asegúrate de que esté por encima de otros modales */
}

/* Estilos para el contenedor del modal */
.add-cosplay-overlay {
  position: fixed;
  /* Cubre toda la ventana */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  /* Fondo oscuro semitransparente */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  /* Asegurarse de que esté por encima de todo */
}

/* Estilos para el formulario dentro del modal */
.add-cosplay-form-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}
</style>