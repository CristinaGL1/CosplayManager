<template>
  <div>
    <NavigationBar :userLogged="userLogged" @toggle-add-cosplay="showAddCosplay = !showAddCosplay"
                     @logout-user="logout" />

    <div class="dashboard-layout" style="padding-top: 60px;">
      <section class="lateralNav">
        <h3>Lista de Compras</h3>
        <ul>
          <li v-for="item in shoppingList" :key="item.id">
            <input type="checkbox" :checked="item.completado"> {{ item.nombre }}
          </li>
        </ul>
        <button @click="openAddItemModal">+</button>
      </section>

      <section class="kanban-container" style="width: 80vw; padding: 30px; overflow-y: auto; justify-content: flex-start; align-items: flex-start; display: flex; flex-wrap: wrap; gap: 25px;">
        <div class="kanban-board" style="display: flex; gap: 1rem; overflow-x: auto; padding: 1rem; border-radius: 10px; flex-grow: 1;">
          <div class="kanban-column" v-for="state in possibleTaskStates" :key="state">
  <div class="cardSection-title">
    <div class="cardSection-tittle-bg"></div>
    <h3>{{ state }}</h3>
  </div>
  <div class="kanban-cardSection">
    <div class="cardSection-bg"></div>
    <div class="add-task-button-in-column">
      <button @click="openAddTaskModal(state)">+</button>
    </div>
    <div v-for="task in tasksInState(state)" :key="task.id" class="kanban-card">
      <div class="task-item">
        <strong>{{ task.nombre }}</strong>
        <p>{{ task.descripcion }}</p>
        <div class="options-buttons">
          <button @click="verDetallesTarea(task.id)" class="details-button">Ver Detalles</button>
          <button @click="eliminarTarea(task.id)" class="details-button">Eliminar</button>
        </div>
      </div>
    </div>
 <!--<div class="add-button-container">
      <button @click="openAddTaskModal(state)">+</button>
    </div>-->
  </div>
</div>
        </div>
      </section>
    </div>

    <teleport to="body">
      <div v-if="showAddTaskModal" class="modal-overlay">
        <div class="modal-content">
          <h3>Añadir Nueva Tarea a {{ addTaskModalState }}</h3>
          <label for="task-title">Título:</label>
          <input type="text" id="task-title" v-model="newTaskName" />
          <label for="task-description">Descripción (opcional):</label>
          <textarea id="task-description" v-model="newTaskDescription"></textarea>
          <div class="modal-buttons">
            <button @click="addNewTaskFromModal">Guardar</button>
            <button @click="showAddTaskModal = false; newTaskName = ''; newTaskDescription = ''; addTaskModalState = null;">Cancelar</button>
          </div>
        </div>
      </div>
    </teleport>

    <div v-if="mensajeLogout" class="notification">{{ mensajeLogout }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import NavigationBar from '../components/NavigationBar.vue';
import { useRouter, useRoute } from 'vue-router';
import { getCosplay } from '../firestore';

const router = useRouter();
const route = useRoute();
const cosplayId = ref(route.params.id);
const selectedCosplay = ref(null);
const showAddCosplay = ref(false);
const userLogged = ref(false);
const mensajeLogout = ref('');
const localUserId = ref(route.query.userId);

const possibleTaskStates = ['Sin empezar', 'En proceso', 'Finalizado'];
const showAddTaskModal = ref(false);
const addTaskModalState = ref(null);
const newTaskName = ref('');
const newTaskDescription = ref('');

const tasksGroupedByState = computed(() => {
  const groups = {};
  if (selectedCosplay.value && selectedCosplay.value.tareas) {
    selectedCosplay.value.tareas.forEach(task => {
      if (!groups[task.estado]) {
        groups[task.estado] = [];
      }
      groups[task.estado].push(task);
    });
  }
  return groups;
});

const tasksInState = (state) => tasksGroupedByState.value[state] || [];
const shoppingList = computed(() => selectedCosplay.value ? selectedCosplay.value.listaCompra : []);

const loadCosplayDetails = async (id) => {
  if (!id || !localUserId.value) {
    console.warn('No se proporcionó ID de cosplay o userId para cargar los detalles.');
    selectedCosplay.value = null;
    return;
  }
  try {
    const cosplayData = await getCosplay(localUserId.value, id);
    selectedCosplay.value = cosplayData;
    console.log('Detalles del cosplay cargados:', cosplayData);
  } catch (error) {
    console.error('Error al cargar los detalles del cosplay:', error);
    selectedCosplay.value = null;
  }
};

const logout = async () => {
  console.log('Función logout en Dashboard llamada');
  await signOut(getAuth());
  mensajeLogout.value = "Sesión cerrada";
  router.push('/');
};

const openAddTaskModal = (state) => {
  addTaskModalState.value = state;
  showAddTaskModal.value = true;
};

const addNewTaskFromModal = () => {
  if (newTaskName.value.trim() !== '') {
    const newTask = {
      id: Date.now(),
      nombre: newTaskName.value,
      descripcion: newTaskDescription.value,
      estado: addTaskModalState.value
    };
    if (!selectedCosplay.value.tareas) {
      selectedCosplay.value.tareas = [];
    }
    selectedCosplay.value.tareas.push(newTask);
    selectedCosplay.value = { ...selectedCosplay.value };
    showAddTaskModal.value = false;
    newTaskName.value = '';
    newTaskDescription.value = '';
    addTaskModalState.value = null;
  } else {
    alert('Por favor, escribe un título para la tarea.');
  }
};

const openAddItemModal = () => {
  console.log('Abrir modal para añadir item a la lista de compras');
  // Aquí podrías mostrar un modal para añadir un nuevo item a la lista de compras
};

const verDetallesTarea = (taskId) => {
  console.log('Ver detalles de la tarea:', taskId);
  // Aquí podrías mostrar un modal con los detalles de la tarea
};

const eliminarTarea = (taskId) => {
  console.log('Eliminar tarea:', taskId);
  // Aquí podrías implementar la lógica para eliminar la tarea
};

onMounted(() => {
  onAuthStateChanged(getAuth(), (user) => {
    userLogged.value = !!user;
    if (user && route.params.id && route.query.userId) {
      localUserId.value = route.query.userId;
      loadCosplayDetails(route.params.id);
    } else if (user) {
      console.warn('ID de cosplay o userId no encontrado inicialmente en el Dashboard.');
      selectedCosplay.value = null;
    } else {
      selectedCosplay.value = null;
    }
  });
});

watch(() => route.params.id, (newId) => {
  if (newId && localUserId.value) {
    loadCosplayDetails(newId);
  } else {
    selectedCosplay.value = null;
  }
});
</script>

<style scoped>
#app {
  height: 100%;
  width: 100%;
}

.dashboard-layout {
  height: 100%;
  width: 100%;
  display: flex;
  padding-top: 60px;
  box-sizing: border-box;
}

.lateralNav {
  width: 20vw;
  background-color: #222;
  color: #eee;
  border-right: 2px solid #444;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
  flex-direction: column;
  height: calc(100vh - 60px);
}

.lateralNav h3 {
  margin-top: 0;
  margin-bottom: 15px;
}

.lateralNav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
}

.lateralNav li {
  padding: 10px 0;
  border-bottom: 1px solid #444;
  color: #eee;
  display: flex;
  align-items: center;
}
.lateralNav li:last-child {
  border-bottom: none;
}

.lateralNav li input[type="checkbox"] {
  margin-right: 0.5rem;
}

.lateralNav button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #333;
  color: #eee;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
}

.lateralNav button:hover {
  background-color: #555;
}

.kanban-container {
  display: flex;
  flex-grow: 1;
  height: calc(100vh - 60px);
  overflow: auto;
}

.kanban-board {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 1rem;
  border-radius: 10px;
  flex-grow: 1;
  height: 100%;
}

.kanban-column {
  flex: 0 0 auto;
  width: 300px;
  min-height: 300px;
  padding: 1rem;
  background-color: none;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border-radius: 10px;
}

.cardSection-title {
  border: 2px solid black;
  padding: 0.5rem;
  background-color: #bfd8f1;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  height: 3rem;
  width: 100%;
  border-radius: 10px;
}

.cardSection-tittle-bg {
  border: 2px solid black;
  background-color: #ffffff;
  position: absolute;
  height: 100%;
  width: 100%;
  top: 15px;
  left: 15px;
  z-index: -1;
  border-radius: 10px;
}

.cardSection-title h3 {
  font-weight: 600;
}

.kanban-cardSection {
  padding: 1rem;
  border: 2px solid black;
  background-color: white;
  position: relative;
  border-radius: 10px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.cardSection-bg {
  border: 2px solid black;
  background-color: #bfd8f1;
  position: absolute;
  height: 100%;
  width: 100%;
  top: 15px;
  left: 15px;
  z-index: -1;
  border-radius: 10px;
}

.kanban-card {
  background-color: white;
  border-radius: 5px;
  padding: 0.5rem; /* Padding reducido */
  margin-bottom: 0.25rem; /* Margen inferior reducido */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  font-size: 0.9em; /* Tamaño de fuente reducido */
}

.kanban-card strong {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: bold;
  font-size: 1em;
}

.task-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.25rem;
  padding: 0.25rem;
  border: 1px solid #f0f0f0;
  border-radius: 3px;
  background-color: #fafafa;
  font-size: 0.85em;
}

.options-buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  margin-top: 0.5rem;
}

.details-button {
  margin: 0;
  padding: 0; /* Eliminamos el padding para que no haya espacio alrededor del texto */
  border: none; /* Eliminamos el borde */
  border-radius: 0; /* Aseguramos que no haya bordes redondeados */
  background-color: transparent; /* Hacemos el fondo transparente */
  color: #007bff; /* Mantenemos el color azul del texto */
  cursor: pointer;
  font-size: 0.9em;
}


.add-button-container {
  position: sticky;
  bottom: 10px; /* Espacio desde la parte inferior */
  right: 10px; /* Espacio desde la derecha */
  display: flex;
  justify-content: flex-end; /* Alinea el botón a la derecha */
  padding: 0; /* Sin padding en el contenedor */
  z-index: 10; /* Asegura que esté por encima de las tarjetas */
}


.add-button-container button {
  padding: 0.25rem 0.5rem; /* Padding más pequeño para el botón */
  border: 1px dashed #ccc;
  background-color: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em; /* Tamaño de fuente más pequeño */
  color: #555;
}
.add-task-button-in-column {
  position: absolute;
  top: 1px; /* Ajusta la distancia desde la parte superior dentro de la columna */
  right: 10px; /* Ajusta la distancia desde la derecha dentro de la columna */
  z-index: 20; /* Asegura que esté por encima de las tarjetas */
}

.add-task-button-in-column button {
  padding: 0;
  border: none;
  background-color: transparent;
  color: #555;
  font-size: 1.8em;
  cursor: pointer;
  line-height: 1;
}

.add-task-button-in-column button:hover {
  color: #000;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  width: 80%;
  max-width: 500px;
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 15px;
  text-align: center;
}

.modal-content label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.modal-content input[type="text"],
.modal-content textarea {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
  box-sizing: border-box;
}

.modal-content textarea {
  min-height: 80px;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}

.modal-buttons button {
  padding: 0.5rem 1rem;
  border: 1px solid #888;
  border-radius: 10px;
  background-color: #f7ecf2;
  color: #000000;
  font-weight: bold;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.modal-buttons button:hover {
  background-color: #ffdef0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}
</style>