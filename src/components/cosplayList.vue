<template>
  <div>
    <div class="kanban-board">
      <div class="kanban-column" v-for="state in possibleStates" :key="state">
        <div class="cardSection-title">
          <div class="cardSection-tittle-bg"></div>
          <h3>{{ state }}</h3>
        </div>
        <div class="kanban-cardSection">
          <div class="cardSection-bg"></div>
          <div class="kanban-card" v-for="(cosplay, index) in cosplaysInState(state)" :key="cosplay ? cosplay.id : 'empty-' + state + '-' + index" :class="{ 'empty-card': !cosplay }">
            <template v-if="cosplay">
              <strong>{{ cosplay.nombre }}</strong>
              <p class="cosplay-description">{{ cosplay.descripcion }}</p>
              <div class="options-buttons">
                <button @click="verDetalles(cosplay.id)" class="details-button">Ver Detalles</button>
                <button @click="eliminarCosplay(cosplay.id)" class="details-button">Eliminar</button>
              </div>
            </template>
            <template v-else>
              <p style="color: #999; font-style: italic;">No hay cosplays en este estado.</p>
            </template>
          </div>
          <div v-if="cosplaysInState(state).length === 0 && groupedCosplaysKeys.length > 0" class="empty-state-message">
            No hay cosplays en este estado.
          </div>
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
import { useRouter } from 'vue-router';
import axios from 'axios';

const props = defineProps({
  cosplays: {
    type: Array,
    required: true
  }
});


</script>

<style scoped>
.kanban-board {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  /* Para que sea scrollable horizontalmente si hay muchos estados */
  padding: 1rem;
  border-radius: 10px; /* añado esto */
}

.kanban-column {
  flex: 0 0 auto;
  /* No se estiren ni se encojan, ancho automático */
  width: 300px;
  min-height: 50vh;
  padding: 1rem;
  background-color: none;
  display: flex;
  /* Convertimos la columna en un contenedor flex */
  flex-direction: column;
  /* Alineamos los elementos verticalmente */
  align-items: stretch;
  /* Estiramos los elementos hijos horizontalmente */
  border-radius: 10px; /* añado esto */
}


.kanban-card {
  background-color: white;
  border: 1px solid #eee;
  border-radius: 5px;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  /* Espacio para el botón */

  overflow: hidden;
  /* Oculta el contenido que se desborda */

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.kanban-card strong {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;

}

.cardSection-title{
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
  border-radius: 10px; /* Añade esto */
  
}

.cardSection-tittle-bg{
  border: 2px solid black;
  background-color: #ffffff;
  position: absolute;
  height: 100%;
  width: 100%;
  top: 15px;
  left: 15px;
  z-index: -1;
   border-radius: 10px; /* Añad esto */
}

.cardSection-title h3{
  font-weight: 600;
}

.kanban-cardSection{
  padding: 1rem 1rem;
  border: 2px solid black;
  background-color: rgb(255, 255, 255);
  position: relative;
   border-radius: 10px; /*añado esto*/
}

.cardSection-bg{
  border: 2px solid black;
  background-color: #bfd8f1;
  position: absolute;
  height: 100%;
  width: 100%;
  top: 15px;
  left: 15px;
  z-index: -1;
  border-radius: 10px; /* Añade esto */

}

.cosplay-description {
  margin-top: 0.25rem;
  font-size: 0.9em;
  color: #555;
  margin-bottom: 1.5rem;
  /* Añadimos espacio para el botón */
  width: 100%;
  min-height: 10px;
}

.options-buttons{
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}

.kanban-card button {
  padding: 0;
  border: none;
  border-radius: 0;
  background-color: transparent;
  color: #ff69b4;
  cursor: pointer;
  font-size: 0.8em;
}


.details-button {
  margin: 0%;
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

.kanban-card button:hover {
  background-color: transparent;
  text-decoration: underline;
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
.empty-card {
  /* Estilos para cuando no hay cosplay en la tarjeta */
  box-shadow: 1;
}

.empty-state-message {
  color: #777;
  font-style: italic;
  padding: 0.5rem;
  text-align: center;
}
</style>