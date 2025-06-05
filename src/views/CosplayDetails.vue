<template>
  <div class="detail-overlay">
    <div class="detail-container">
      <h2 class="detail-title">{{ cosplay?.nombre }}</h2>

      <div v-if="cosplay">
        <div v-if="!editando" class="cosplay-info">
          <div class="cosplay-header">
            <div v-if="cosplay.imagenURL" class="cosplay-main-image">
              <img :src="'backend' + cosplay.imagenURL" alt="Imagen principal del cosplay"
                style="width: 150px; height: 150px; object-fit: cover; border-radius: 8px; margin-right: 20px;">
            </div>
            <div class="header-info">
              <p class="info-label">Estado:</p>
              <p class="info-value">{{ cosplay.estado }}</p>
              <p class="info-label">Fecha de Inicio:</p>
              <p class="info-value">{{ cosplay.fechaInicio ? formatFecha(cosplay.fechaInicio) : '.' }}</p>
              <p class="info-label">Fecha de Fin:</p>
              <p class="info-value">{{ cosplay.fechaFin ? formatFecha(cosplay.fechaFin) : '.' }}</p>
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

        <!-- ---------------------------------- PESTAÑA DE EDICION ---------------------------------- -->
        <div v-else class="edit-section">
          <form @submit.prevent="guardarEdicion">
            <label>
              Nombre:
              <input v-model="formNombre" type="text" />
            </label>

            <label>
              Estado:
              <select v-model="formEstado">
                <option>Sin empezar</option>
                <option>En proceso</option>
                <option>Finalizado</option>
              </select>
            </label>

            <label>
              Descripción:
              <textarea v-model="formDescripcion" rows="3"></textarea>
            </label>

            <label>
              Fecha de Inicio:
              <input v-model="formFechaInicio" type="date" />
            </label>

            <label>
              Fecha de Fin:
              <input v-model="formFechaFin" type="date" />
            </label>

            <label>
              URL Imagen (opcional):
              <input v-model="formImagenUrl" type="text" class="border p-1 w-full" />
              <small class="block mt-1 text-gray-600 text-sm">
                Si prefieres usar una URL externa.
              </small>
            </label>

            <label>
              Subir Imagen:
              <input type="file" @change="handleImageUpload" accept="image/*" class="border p-1 w-full" />
              <small class="block mt-1 text-gray-600 text-sm">
                Selecciona un archivo de imagen para subir.
              </small>
            </label>

            <div class="edit-button-group">
              <button @click="cancelarEdicion" class="registerButton">Cancelar</button>
              <input type="submit" @click="guardarEdicion" class="registerButton" value="Guardar"></input>
            </div>
          </form>
        </div>
      </div>

      <div v-else class="loading-message">Cargando detalles del cosplay...</div>

      <div class="button-group">
        <button v-if="!editando" @click="$emit('close')" class="button registerButton">
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
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const cosplayId = route.params.id;
const cosplay = ref(null);
const editando = ref(false);
const uploadedImage = ref(null); // Para almacenar el archivo de imagen seleccionado


const selectedCosplay = {
  nombre: "",
  estado: "",
  descripcion: "",
  fechaInicio: "",
  fechaFin: "",
  imagenURL: ""
}

const formNombre = ref('');
const formEstado = ref('');
const formDescripcion = ref('');
const formFechaInicio = ref('');
const formFechaFin = ref('');
const formImagenURL = ref('');


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
  if (typeof fechaStr === 'object' && fechaStr.toDate) {
    return fechaStr.toDate().toLocaleDateString();
  }
  const fecha = new Date(fechaStr);
  return fecha.toLocaleDateString();
};


const loadCosplayDetailsFromBackend = async () => {

  try {
    const response = await axios.get(`http://localhost:3000/api/cosplays/${localStorage.selectedCosplay}`);
    cosplay.value = response.data[0];

    selectedCosplay.nombre = cosplay.value.nombre;
    selectedCosplay.estado = cosplay.value.estado;
    selectedCosplay.descripcion = cosplay.value.descripcion;
    selectedCosplay.fechaInicio = cosplay.value.fechaInicio;
    selectedCosplay.fechaFin = cosplay.value.fechaFin;
    selectedCosplay.imagenURL = cosplay.value.imagenURL;

    console.log(selectedCosplay)
  } catch (error) {
    console.error('Error al obtener el cosplay desde el backend:', error);
  }

};

const iniciarEdicion = () => {
  editando.value = true;

  formNombre.value = selectedCosplay.nombre;
  formEstado.value = selectedCosplay.estado;
  formDescripcion.value = selectedCosplay.descripcion;
  formFechaInicio.value = selectedCosplay.fechaInicio;
  formFechaFin.value = selectedCosplay.fechaFin;
  formImagenURL.value = selectedCosplay.imagenURL;

};

const cancelarEdicion = () => {
  editando.value = false;
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  uploadedImage.value = file;
  console.log('Imagen seleccionada:', file);
};




const guardarEdicion = async () => {

  if (formFechaInicio.value == '') {
    formFechaInicio.value = null;
  }

  if (formFechaFin.value == '') {
    formFechaFin.value = null;
  }

  try {
    const response = await axios.put(`http://localhost:3000/changecosplay/${localStorage.selectedCosplay}`, {
      nombre: formNombre.value,
      estado: formEstado.value,
      descripcion: formDescripcion.value,
      fechaInicio: formFechaInicio.value,
      fechaFin: formFechaFin.value,
      imagenURL: formImagenURL.value
    });

    cosplay.value = response.data;
    editando.value = false;
    alert('Cosplay actualizado correctamente');
  } catch (error) {
    console.error('Error al actualizar el cosplay en el backend:', error);
    alert('Error al guardar cambios');
  }
};


onMounted(loadCosplayDetailsFromBackend);
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
  /* Centra horizontalmente */
  align-items: center;
  /* Centra verticalmente */
  z-index: 1010;
  padding-left: 21vw;
  /* Evita la barra lateral */
  padding-right: 1vw;
  /* Margen derecho */
  padding-top: 12vh;
  /* Margen superior */
  padding-bottom: 3vh;
  /* Margen inferior */
  box-sizing: border-box;
}

.detail-container {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  font-family: 'Arial', sans-serif;
  padding: 30px;
  width: 102%;
  /* Casi todo el ancho */
  height: 99%;
  /* Casi toda la altura */
  max-width: 1200px;
  max-height: 1000px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  /* Añade esta línea */
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

.button-group {
  margin-top: 20px;
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  /* Alinea los botones a la derecha */
  position: absolute;
  bottom: 20px;
  right: 30px;
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

.info-pair {
  display: flex;
  /* Alinea etiqueta y valor en la misma línea */
  align-items: baseline;
  /* Alinea la base del texto */
  margin-bottom: 5px;
  /* Espacio entre pares */
}

.info-label {
  font-weight: bold;
  color: #292929;
  margin-right: 10px;
  display: block;
}

.info-value {
  color: #333;

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