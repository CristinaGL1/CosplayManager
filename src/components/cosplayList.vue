<template>
  <div>
    <h2>Tablero de Cosplays</h2>
    <div class="kanban-board">
      <div class="kanban-column" v-for="(cosplaysInThisState, state) in groupedCosplays" :key="state">
        <h3>{{ state }}</h3>
        <div class="kanban-card" v-for="cosplay in cosplaysInThisState" :key="cosplay.id">
          <strong>{{ cosplay.nombre }}</strong>
          <p class="cosplay-description">{{ cosplay.descripcion }}</p>
          <button @click="verDetalles(cosplay.id)" class="details-button">Ver Detalles</button>
          <button @click="eliminarCosplay(cosplay.id)">Eliminar</button>
        </div>
      </div>
    </div>
    <div v-if="mostrarMensajeEliminar" class="notification">
      {{ mensajeEliminar }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { db } from '../firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'vue-router';

const props = defineProps({
  cosplays: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['cosplay-eliminado']);
const router = useRouter();

const mensajeEliminar = ref('');
const mostrarMensajeEliminar = ref(false);

const groupedCosplays = computed(() => {
  const groups = {};
  props.cosplays.forEach(cosplay => {
    if (!groups[cosplay.estado]) {
      groups[cosplay.estado] = [];
    }
    groups[cosplay.estado].push(cosplay);
  });
  return groups;
});

const verDetalles = (id) => {
  router.push(`/cosplay/${id}`);
};

const eliminarCosplay = async (id) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
    alert('Debes estar logueado para eliminar cosplays.');
    return;
  }

  if (confirm(`¿Seguro que quieres eliminar este cosplay ?`)) {
    try {
      await deleteDoc(doc(db, 'cosplays', id));
      console.log('Cosplay eliminado:', id);
      emit('cosplay-eliminado', id); // Emitir un evento para actualizar la lista en el padre

      mensajeEliminar.value = 'Cosplay eliminado 🗑️';
      mostrarMensajeEliminar.value = true;
      setTimeout(() => {
        mostrarMensajeEliminar.value = false;
        mensajeEliminar.value = '';
      }, 3000);

    } catch (error) {
      console.error('Error al eliminar el cosplay:', error);
      alert('No se pudo eliminar el cosplay.');
    }
  }
};
</script>

<style scoped>
.kanban-board {
  display: flex;
  gap: 1rem;
  overflow-x: auto; /* Para que sea scrollable horizontalmente si hay muchos estados */
  padding: 1rem;
}

.kanban-column {
  flex: 0 0 auto; /* No se estiren ni se encojan, ancho automático */
  width: 300px; /* Ancho fijo para cada columna */
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 1rem;
  background-color: #f9f9f9;
  display: flex; /* Convertimos la columna en un contenedor flex */
  flex-direction: column; /* Alineamos los elementos verticalmente */
  align-items: stretch; /* Estiramos los elementos hijos horizontalmente */
}

.kanban-column h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  text-align: center;
}

.kanban-card {
  background-color: white;
  border: 1px solid #eee;
  border-radius: 5px;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  padding-bottom: 2rem; /* Espacio para el botón */
   height: 100px; /* Establece una altura fija - ajusta este valor */
  overflow: hidden; /* Oculta el contenido que se desborda */
}

.kanban-card strong {
  display: block;
  margin-bottom: 0.5rem;
}

.cosplay-description {
  margin-top: 0.25rem;
  font-size: 0.9em;
  color: #555;
  margin-bottom: 1.5rem; /* Añadimos espacio para el botón */
}

.kanban-card button {
  position: absolute;
  bottom: 0.1rem; /* Ajusta este valor para mover el botón verticalmente */
  right: 0.5rem;
  padding: 0;
  border: none;
  border-radius: 0;
  background-color: transparent;
  color: #ff69b4;
  cursor: pointer;
  font-size: 0.7em;
}

.kanban-card button:hover {
  background-color: transparent;
  text-decoration: underline;
}

.details-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid #007bff;
  border-radius: 5px;
  background-color: white;
  color: #007bff;
  cursor: pointer;
  font-size: 0.7em;
}

.details-button:hover {
  background-color: #e0f7fa;
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