<template>
  <div class="detail-overlay">
    <div class="detail-container">
      <h2 class="detail-title">{{ cosplay?.nombre }}</h2>

      <div v-if="cosplay">
        <div v-if="!editando" class="cosplay-info">
          <div class="cosplay-header">
            <div v-if="cosplay.imagenUrl" class="cosplay-main-image">
              <img :src="cosplay.imagenUrl" alt="Imagen principal del cosplay" style="max-width: 100px; max-height: 50px; border-radius: 8px; margin-right: 10px;">
            </div>
            <div class="header-info">
              <h2 class="cosplay-name">{{ cosplay.nombre }}</h2>
              <p class="info-label">Estado:</p>
              <p class="info-value">{{ cosplay.estado }}</p>
              <p v-if="cosplay.fechaInicio" class="info-label">Fecha de Inicio:</p>
              <p class="info-value">{{ formatFecha(cosplay.fechaInicio) }}</p>
              <p v-if="cosplay.fechaFin" class="info-label">Fecha de Fin:</p>
              <p class="info-value">{{ formatFecha(cosplay.fechaFin) }}</p>
            </div>
          </div>

          <div class="detail-body">
            <h3 class="body-title">Descripción</h3>
            <p class="info-value" v-if="cosplay?.descripcion">{{ cosplay.descripcion }}</p>
            <p class="info-value" v-else>No hay descripción.</p>

            <h3 class="body-title">Elementos del Cosplay</h3>
            <div class="cosplay-elements">
              <p class="info-value">Aquí iría la lista de elementos (funcionalidad a implementar).</p>
            </div>
          </div>
        </div>
        <div v-else class="edit-section">
          <label>
            Nombre:
            <input v-model="form.nombre" type="text" />
          </label>

          <label>
            Estado:
            <select v-model="form.estado">
              <option>En proceso</option>
              <option>Terminado</option>
              <option>Pendiente</option>
            </select>
          </label>

          <label>
            Descripción:
            <textarea v-model="form.descripcion" rows="3"></textarea>
          </label>

          <label>
            Fecha de Inicio:
            <input v-model="form.fechaInicio" type="date" />
          </label>

          <label>
            Fecha de Fin:
            <input v-model="form.fechaFin" type="date" />
          </label>

          <label>
            URL Imagen:
            <input v-model="form.imagenUrl" type="text" />
          </label>

          <div class="edit-button-group">
            <button @click="guardarEdicion" class="registerButton">
              Guardar
            </button>
            <button @click="cancelarEdicion" class="registerButton">
              Cancelar
            </button>
          </div>
        </div>
      </div>

      <div v-else class="loading-message">Cargando detalles del cosplay...</div>

      <div class="button-group">
        <button @click="$router.go(-1)" class="button registerButton">
          Volver
        </button>
        <button v-if="cosplay && !editando" @click="iniciarEdicion" class="button registerButton">
          Editar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const route = useRoute();
const router = useRouter();
const cosplayId = route.params.id;
const cosplay = ref(null);
const editando = ref(false);

const form = reactive({
  nombre: '',
  estado: '',
  descripcion: '',
  fechaInicio: '',
  fechaFin: '',
  imagenUrl: ''
});

const formatFecha = (fechaStr) => {
  if (!fechaStr) return '';
  // Si la fecha viene como timestamp de Firestore, convierte a Date
  if (typeof fechaStr === 'object' && fechaStr.toDate) {
    return fechaStr.toDate().toLocaleDateString();
  }
  const fecha = new Date(fechaStr);
  return fecha.toLocaleDateString();
};

const iniciarEdicion = () => {
  console.log('Botón Editar clickeado');
  form.nombre = cosplay.value.nombre || '';
  form.estado = cosplay.value.estado || '';
  form.descripcion = cosplay.value.descripcion || '';
  form.fechaInicio = cosplay.value.fechaInicio
    ? typeof cosplay.value.fechaInicio === 'object' && cosplay.value.fechaInicio.toDate
      ? cosplay.value.fechaInicio.toDate().toISOString().substr(0, 10)
      : cosplay.value.fechaInicio
    : '';
  form.fechaFin = cosplay.value.fechaFin
    ? typeof cosplay.value.fechaFin === 'object' && cosplay.value.fechaFin.toDate
      ? cosplay.value.fechaFin.toDate().toISOString().substr(0, 10)
      : cosplay.value.fechaFin
    : '';
  form.imagenUrl = cosplay.value.imagenUrl || '';
  editando.value = true;
  console.log('Valor de editando:', editando.value);
};

const cancelarEdicion = () => {
  editando.value = false;
};

const guardarEdicion = async () => {
  try {
    const docRef = doc(db, 'cosplays', cosplayId);
    await updateDoc(docRef, {
      nombre: form.nombre,
      estado: form.estado,
      descripcion: form.descripcion,
      fechaInicio: form.fechaInicio || null,
      fechaFin: form.fechaFin || null,
      imagenUrl: form.imagenUrl
    });
    // Actualiza localmente el cosplay
    cosplay.value = { id: cosplayId, ...form };
    editando.value = false;
    alert('Cosplay actualizado correctamente');
  } catch (error) {
    console.error('Error al actualizar:', error);
    alert('Error al guardar cambios');
  }
};

onMounted(async () => {
  if (cosplayId) {
    try {
      const docRef = doc(db, 'cosplays', cosplayId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        cosplay.value = { id: docSnap.id, ...docSnap.data() };
      } else {
        console.warn('Cosplay no encontrado.');
        router.replace('/'); // O muestra una alerta
      }
    } catch (error) {
      console.error('Error al obtener el cosplay:', error);
    }
  }
});
</script>

<style scoped>
.detail-overlay {
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

.detail-container {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  font-family: 'Arial', sans-serif;
  padding: 30px;
  max-width: 900px; /* Ancho máximo consistente */
  width: 90%;
  max-height: 90vh; /* Alto máximo consistente */
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.detail-title {
  font-size: 2em;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  text-align: center;
}

.cosplay-info {
  margin-bottom: 20px;
}

.cosplay-header {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  align-items: center;
}

.cosplay-main-image {
  flex-shrink: 0;
}

.header-info {
  flex-grow: 1;
}

.info-label {
  font-weight: bold;
  color: #555;
  margin-bottom: 3px;
  display: block;
}

.info-value {
  color: #333;
  margin-bottom: 8px;
}

.detail-body {
  margin-bottom: 20px;
}

.body-title {
  font-size: 1.5em;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}

.cosplay-elements {
  margin-top: 10px;
}

.button-group {
  margin-top: 20px;
  display: flex;
  gap: 15px;
  justify-content: flex-end;
}

.button {
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.3s ease;
}

.registerButton {
  padding: 0.5rem 1rem;
  border: 1px solid #888;
  background-color: #f7ecf2;
  color: #000000;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  width: auto;
  font-size: 0.9em;
  border-radius: 10px;
}

.registerButton:hover {
  background-color: #ffdef0;
}

.button-volver {
  background-color: #6c757d;
}

.button-volver:hover {
  background-color: #5a6268;
}

.button-editar {
  background-color: #ffc107;
  color: #333;
}

.button-editar:hover {
  background-color: #e0a800;
}

.button-guardar {
  background-color: #28a745;
}

.button-guardar:hover {
  background-color: #218838;
}

.button-cancelar {
  background-color: #dc3545;
}

.button-cancelar:hover {
  background-color: #c82333;
}

.loading-message {
  color: #777;
  font-style: italic;
  margin-top: 20px;
}

.edit-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.edit-section label {
  display: block;
  font-weight: bold;
  color: #333;
  margin-top: 10px;
}

.edit-section input[type="text"],
.edit-section input[type="date"],
.edit-section select,
.edit-section textarea {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
  font-size: 1em;
}

.edit-section textarea {
  min-height: 80px;
}

.edit-button-group {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.edit-button-group button {
  padding: 0.5rem 1rem;
  border: 1px solid #888;
  background-color: #f7ecf2;
  color: #000000;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 0.9em;
  border-radius: 10px;
}

.edit-button-group button:hover {
  background-color: #ffdef0;
}
</style>