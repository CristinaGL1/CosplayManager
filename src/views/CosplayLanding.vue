<template>
  <nav>
    <NavigationBar :userLogged="userLogged" @toggle-add-cosplay="showAddCosplay = !showAddCosplay"
                     @logout-user="logout" />
  </nav>
  <div class="cosplay-area">
    <AddCosplay v-if="showAddCosplay" @cosplay-agregado="refetchCosplays"
                @ocultar-formulario="showAddCosplay = false" />
  </div>

  <div v-if="mensajeLogout" class="notification">{{ mensajeLogout }}</div>

  <div class="cl">
    <section class="lateralNav">
      <h1>Cosplay</h1>
      <input type="text" placeholder="Buscar cosplay">
      <ul v-if="cosplays.length > 0">
        <li v-for="cosplay in cosplays" :key="cosplay.id" @click="openModal(cosplay.id)" class="list-item-link">
          {{ cosplay.nombre }}
        </li>
      </ul>
      <p v-else>No hay cosplays.</p>
    </section>

    <section class="cosplayGrid">
      <div class="new-cosplay-item" style="display: flex; flex-direction: column; align-items: center;">
        <div class="new-cosplay-container" @click="showAddCosplay = true">
          <div class="plus-icon">+</div>
        </div>
        <div class="new-cosplay-text" style="margin-top: 5px;">Nuevo Cosplay</div>
      </div>
      <div v-for="cosplay in cosplays" :key="cosplay.id" class="cosplay-item" @click="openModal(cosplay.id)">
        <div class="cosplay-thumbnail">
          <img v-if="cosplay.imagenURL" :src="'http://localhost:3000' + cosplay.imagenURL"
               alt="Imagen del cosplay" class="thumbnail-image">
          <div v-else class="no-image">Sin imagen</div>
        </div>
        <div class="cosplay-name">{{ cosplay.nombre }}</div>
      </div>
    </section>

    <section class="gridScroll">

    </section>
  </div>

  <div v-if="showDetailsModal" class="details-modal-overlay">
    <CosplayDetails :id="selectedCosplayIdForDetails" @close="showDetailsModal = false" />
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
import NavigationBar from '../components/NavigationBar.vue';
import { ref, onMounted, watch } from 'vue';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { getCosplays } from '../firestore';
import { useRouter, useRoute } from 'vue-router'; // Importa useRoute
import AddCosplay from '../components/addCosplay.vue';
import CosplayOptionsModal from '../components/CosplayOptionsModal.vue'; // Importa el modal
import CosplayDetails from '../views/CosplayDetails.vue'; // Importa CosplayDetails

const route = useRoute(); // Usa useRoute para acceder a la ruta actual
const router = useRouter();
const localUserId = ref(route.query.userId); // Obtén el userId de la query
const cosplays = ref([]);
const showAddCosplay = ref(false);
const userLogged = ref(false);
const mensajeLogout = ref('');
const showOptionsModal = ref(false); // Controla la visibilidad del modal
const selectedCosplayIdForModal = ref(null);
const selectedCosplayId = ref(null); // Almacena el ID del cosplay clickeado
const showDetailsModal = ref(false);
const selectedCosplayIdForDetails = ref(null);

const fetchCosplays = async (currentUserId) => {
  if (!currentUserId) {
    console.warn('No se proporcionó userId para cargar cosplays en CosplayLanding.');
    cosplays.value = [];
    return;
  }
  console.log('Cargando cosplays para userId:', currentUserId);
  try {
    const data = await getCosplays(currentUserId);
    console.log('Cosplays cargados:', data);
    cosplays.value = data; // Usamos directamente 'data' aquí
    console.log('cosplays.value en fetchCosplays:', cosplays.value);
    console.log('Contenido de cosplays.value:', cosplays.value);
  } catch (error) {
    console.error('Error al cargar los cosplays:', error);
  }
};

const logout = async () => {
  console.log('Función logout en Dashboard llamada');
  await signOut(getAuth());
  mensajeLogout.value = "Sesión cerrada";
  router.push('/'); // Redirigir al login
};

const refetchCosplays = () => {
  if (localUserId.value) {
    fetchCosplays(localUserId.value);
  } else {
    console.warn('No se puede recargar cosplays, userId no disponible.');
  }
};

const openModal = (id) => {
  selectedCosplayIdForModal.value = id;
  showOptionsModal.value = true;
};

const goToDashboard = (id) => {
  showOptionsModal.value = false;
  router.push(`/dashboard/${id}?userId=${localUserId.value}`);
};

const goToDetails = (id) => {
  showOptionsModal.value = false; // Cierra el modal de opciones
  selectedCosplayIdForDetails.value = id; // Guarda el ID para los detalles
  showDetailsModal.value = true; // Muestra el modal de detalles
};

onMounted(() => {
  onAuthStateChanged(getAuth(), (user) => {
    userLogged.value = !!user;
    if (user) {
     //ocalUserId.value = '3'; // <---- FORZANDO EL USER ID PARA PRUEBA
      fetchCosplays(localUserId.value);
    } else {
      cosplays.value = [];
    }
  });
});

watch(() => route.query, (newRoute) => {
  console.log('Ruta cambiada en Landing:', newRoute);
  if (newRoute && newRoute.query && newRoute.query.userId) {
    localUserId.value = newRoute.query.userId;
    fetchCosplays(localUserId.value);
  } else {
    console.warn('userId no encontrado en la ruta de Landing.');
    cosplays.value = [];
  }
});

const delayedLoadCosplays = () => {
  setTimeout(() => {
    if (localUserId.value) {
      fetchCosplays(localUserId.value);
    } else {
      console.warn('No se puede recargar cosplays, userId no disponible.');
    }
  }, 1000);
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

.lateralNav {
    width: 20vw;
    background-color: #222;
    /* Fondo oscuro */
    color: #eee;
    border-right: 2px solid #444;
    padding: 20px;
    box-sizing: border-box;
    overflow-y: auto;
    /* Por si la lista es larga */
}

.lateralNav h1 {
    margin-top: 0;
    margin-bottom: 15px;
}

.lateralNav input[type="text"] {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: none;
    border-radius: 5px;
    background-color: #444;
    color: #eee;
    box-sizing: border-box;
    margin-top: 20px;
}

.lateralNav ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.lateralNav li {
    padding: 10px 0;
    border-bottom: 1px solid #444;
    cursor: pointer;
}

.lateralNav li:last-child {
    border-bottom: none;
}

.list-item-link {
    cursor: pointer;
}


.grdiScroll {
    width: 10vw;
    background-color: var(--mainColor);
    border-right: 2px solid var(--secondaryColor);
}

.cosplay-main-area {
  display: flex;
  width: 80vw; /* El ancho restante */
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
    flex-grow: 1; /* Ocupa el espacio disponible */
}

/* Estilos para la tarjeta de detalles */
.cosplay-details-card {
  width: 400px; /* Ancho de la tarjeta */
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
  margin-left: 20px; /* Espacio entre la grid y la tarjeta */
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
  background-color: rgba(0, 0, 0, 0.5); /* Fondo oscuro semitransparente */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1010; /* Asegúrate de que esté por encima de otros modales */
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