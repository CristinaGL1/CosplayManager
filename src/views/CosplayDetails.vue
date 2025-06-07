<template>
  <div class="detail-overlay">
    <div class="detail-container">
      <h2 class="detail-title">{{ cosplay?.nombre }}</h2>

      <div v-if="cosplay">
        <div v-if="!editando" class="cosplay-info">
          <div class="cosplay-header">
            <div v-if="cosplay.imagenURL" class="cosplay-main-image">
              <img :src="'backend' + cosplay.imagenURL" alt="Imagen principal del cosplay">
            </div>
            <div v-else="cosplay.imagenURL" class="cosplay-main-image">
              <img>
            </div>
            <div class="header-info">
              <div class="header-info-colum">
                <div>
                  <p class="info-label">Estado:</p>
                  <p class="info-value">{{ cosplay.estado }}</p>
                </div>
                <div>
                  <p class="info-label">Fecha de Inicio:</p>
                  <p class="info-value">{{ cosplay.fechaInicio ? formatFecha(cosplay.fechaInicio) : '.' }}</p>
                </div>
                <div>
                  <p class="info-label">Fecha de Fin:</p>
                  <p class="info-value">{{ cosplay.fechaFin ? formatFecha(cosplay.fechaFin) : '.' }}</p>
                </div>


              </div>
              <div class="header-info-colum">
                <div>
                  <p class="info-label">Tareas totales:</p>
                  <p class="info-value">2</p>
                </div>
                <div>
                  <p class="info-label">Tareas completadas:</p>
                  <p class="info-value">5</p>
                </div>
                <div>
                  <p class="info-label">Coste total:</p>
                  <p class="info-value">40€</p>
                </div>
              </div>
            </div>
          </div>

          <div class="detail-body">
            <h3 class="body-title">Descripción</h3>
            <p class="info-value" v-if="cosplay?.descripcion">{{ cosplay.descripcion }}</p>
            <p class="info-value" v-else>No hay descripción.</p>
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
              Subir Imagen:
              <input type="file" @change="handleImageUpload" accept="image/*" class="border p-1 w-full" />
              <small class="block mt-1 text-gray-600 text-sm">
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
import axios from 'axios';

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

// Nuevas refs para la gestión de la imagen
const newImagenArchivo = ref(null); // Para guardar el nuevo archivo seleccionado
const editImageInput = ref(null);   // Para resetear el input de tipo file
const newImagePreviewUrl = ref(null); // Para mostrar una vista previa de la nueva imagen



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
  formImagenURL.value = selectedCosplay.imagenURL;

  const fechaInicioSQL = new Date(selectedCosplay.fechaInicio);
  const fechaFinSQL = new Date(selectedCosplay.fechaFin);

  // Obtener las partes de la fecha
  const year1 = fechaInicioSQL.getFullYear();
  const month1 = (fechaInicioSQL.getMonth() + 1).toString().padStart(2, '0'); // getMonth() es 0-indexado, padStart para 2 dígitos
  const day1 = fechaInicioSQL.getDate().toString().padStart(2, '0'); // padStart para 2 dígitos

  const year2 = fechaFinSQL.getFullYear();
  const month2 = (fechaFinSQL.getMonth() + 1).toString().padStart(2, '0'); // getMonth() es 0-indexado, padStart para 2 dígitos
  const day2 = fechaFinSQL.getDate().toString().padStart(2, '0'); // padStart para 2 dígitos

  // Construir el formato YYYY-MM-DD
  const simpleDateIncio = `${year1}-${month1}-${day1}`;
  console.log('YYYY-MM-DD:', simpleDateIncio); // Output: 2023-10-27

  const simpleDateFin = `${year2}-${month2}-${day2}`;
  console.log('YYYY-MM-DD:', simpleDateFin); // Output: 2023-10-27

  formFechaInicio.value = simpleDateIncio;
  formFechaFin.value = simpleDateFin;

  if (formFechaInicio.value == "1970-01-01") {
    formFechaInicio.value = null
  }

  if (formFechaFin.value == "1970-01-01") {
    formFechaFin.value = null
  }

  console.log(formFechaFin)

};

const cancelarEdicion = () => {
  editando.value = false;
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  uploadedImage.value = file;
  console.log('Imagen seleccionada:', file);
};

// Función para manejar la selección de una nueva imagen
const handleEditImageUpload = (event) => {
  newImagenArchivo.value = event.target.files[0];
  if (newImagenArchivo.value) {
    // Generar URL de vista previa para el usuario
    newImagePreviewUrl.value = URL.createObjectURL(newImagenArchivo.value);
  } else {
    newImagePreviewUrl.value = null;
  }
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
    window.location.reload();

  } catch (error) {
    console.error('Error al actualizar el cosplay en el backend:', error);
    alert('Error al guardar cambios');
  }
};


onMounted(() => {
  loadCosplayDetailsFromBackend();
});
</script>

<style scoped>
.detail-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  /* Sombra de fondo oscura */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1010;
  padding-left: 21vw;
  padding-right: 1vw;
  padding-top: 12vh;
  padding-bottom: 3vh;
  box-sizing: border-box;
}

.detail-container {
  background-color: var(--modalColor);
  /* Fondo del modal */
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  font-family: 'Arial', sans-serif;
  /* Consistente con otros modales */
  padding: 0 20px 20px 20px;
  width: 102%;
  height: 99%;
  max-width: 1200px;
  max-height: 1000px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
}

.detail-title {
  font-size: 40px;
  font-weight: bolder;
  /* Más fuerte */
  color: var(--mainColor);
  /* Color principal */
  margin: 10px 0 20px 0;
  border-bottom: 1px solid var(--complementaryColor3);
  /* Borde sutil */
  padding-bottom: 5px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Estilos de información del cosplay (cuando NO se está editando) */
.cosplay-info .info-label {
  font-weight: bold;
  color: var(--complementaryColor);
  /* Color de etiquetas más oscuro */
  margin-right: 10px;
  display: block;
}

.cosplay-info .info-value {
  color: var(--mainColor);
  font-size: 1.5rem;

}

.detail-body .body-title {
  font-size: 1.75em;
  font-weight: 600;

  color: var(--mainColor);

  margin-bottom: 10px;

  padding-bottom: 5px;
}

.cosplay-elements {
  margin-top: 10px;
}

.button-group {
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

.edit-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.edit-section label {
  display: block;
  font-weight: bold;
  color: var(--complementaryColor);
  /* Color de etiquetas de edición */
  margin-top: 10px;
}

/* Estilos para inputs y textareas en la sección de edición */
.edit-section input[type="text"],
.edit-section input[type="date"],
.edit-section textarea {
  width: 100%;
  padding: 10px;
  /* Consistente con otros inputs */
  margin-top: 5px;
  border: 1px solid var(--complementaryColor3);
  /* Borde sutil */
  border-radius: 6px;
  /* Bordes redondeados */
  box-sizing: border-box;
  font-size: 1em;
  background-color: var(--modalColor);
  /* Fondo claro */
  color: var(--mainColor);
  /* Texto oscuro */
}

.edit-section textarea {
  min-height: 100px;
  /* Para que la descripción tenga un tamaño mínimo */
  resize: vertical;
}

/* Estilos para el select en la sección de edición */
.edit-section select {
  width: 100%;
  padding: 10px;
  /* Consistente con otros inputs */
  margin-top: 5px;
  border: none;
  /* Sin borde, usa el fondo color */
  border-radius: 8px;
  /* Redondeado igual que otros selects */
  box-sizing: border-box;
  font-size: 1em;
  background-color: var(--secondaryColor);
  /* Color de fondo secundario */
  color: var(--mainColor);
  /* Texto oscuro */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><path fill="currentColor" d="M4.5 4l3 3 3-3z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 12px;
}

.edit-section select option {
  background-color: var(--secondaryColor);
  /* Fondo de opciones */
  color: var(--mainColor);
  /* Color de texto de opciones */
}

/* Placeholders para inputs y textareas en la sección de edición */
.edit-section input::placeholder,
.edit-section textarea::placeholder {
  color: var(--complementaryColor3);
  opacity: 0.8;
}

/* Estilos para el input de tipo file en la sección de edición */
/* La clase 'border p-1 w-full' se mantiene en el template, esto es para añadir colores */
.edit-section input[type="file"] {
  border: none;
  /* ELIMINA EL BORDE DEL CONTENEDOR DEL INPUT FILE */
  outline: none;
  /* ELIMINA EL OUTLINE DEL CONTENEDOR DEL INPUT FILE */
  background-color: var(--modalColor);
  /* Fondo claro */
  color: var(--mainColor);
  /* Color del texto "Ningún archivo seleccionado" */
  padding: 8px;
  /* Un poco de padding para la caja del input file */
  margin-bottom: 0;
  /* Asegurar que no haya margen extra */
  font-size: 1em;
  /* Asegurar el tamaño del texto */
  border-radius: 6px;
  /* Borde redondeado */
  display: flex;
  /* Para alinear el botón y el texto */
  align-items: center;

}

/* Estilos del botón dentro del input type="file" (pseudo-elementos) */
.edit-section input[type="file"]::-webkit-file-upload-button,
.edit-section input[type="file"]::file-selector-button {
  background-color: var(--secondaryColor);
  /* Color de botón */
  color: var(--mainColor);
  /* Color de texto de botón */
  padding: 0.5rem 1em;
  /* Tamaño de botón consistente */
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  font-size: 0.90em;
  font-weight: bold;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  line-height: normal;

}

.edit-section input[type="file"]::-webkit-file-upload-button:hover,
.edit-section input[type="file"]::file-selector-button:hover {
  background-color: var(--complementaryColor);
  /* Hover más oscuro */
  color: var(--modalColor);
  /* Texto claro en hover */
  transform: translateY(-2px);
}

/* Estilos para la pequeña nota de ayuda del input de archivo */
.edit-section small.block.mt-1.text-gray-600.text-sm {
  display: block;
  margin-top: 5px;
  font-size: 0.85em;
  color: var(--complementaryColor);
  /* Un color más oscuro para la nota */
}


/* Grupos de botones (ya existentes) */
.button-group,
.edit-button-group {
  margin-top: auto;
  display: flex;
  gap: 10px;
  /* Espacio consistente */
  justify-content: flex-end;
}

/* Estilos para los botones con la clase 'registerButton' (ya existentes) */
.button.registerButton,
/* Para el botón "Volver" */
.registerButton,
/* Para los botones "Cancelar", "Editar" */
.edit-button-group input[type="submit"].registerButton {
  /* Para el input submit de "Guardar" */
  padding: 0.5rem 1rem;
  /* Tamaño de botón consistente */
  border: none;
  /* Quitamos el borde gris original */
  background-color: var(--secondaryColor);
  /* Morado de los botones */
  color: var(--mainColor);
  /* Texto oscuro */
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  font-size: 0.90em;
  border-radius: 8px;
  /* Redondeado consistente */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  line-height: normal;
}

.button.registerButton:hover,
.registerButton:hover,
.edit-button-group input[type="submit"].registerButton:hover {
  background-color: var(--complementaryColor);
  color: var(--modalColor);
  transform: translateY(-2px);
}

/* Otros estilos para la información visual */
.cosplay-header {
  font-size: 1.5rem;
  display: flex;
  gap: 2rem;
  height: 20rem;
  margin-bottom: 20px;
  align-items: flex-start;
  /* Alinea la parte superior de la imagen y el texto */
}


.cosplay-main-image {
  display: flex;
  align-items: center;
  height: 20rem;
  min-width: 20rem;
  width: 20rem;
  overflow: hidden;
}

/* Pequeños ajustes para la imagen */
.cosplay-main-image img {
  border: 2px solid var(--complementaryColor3);
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.header-info {
  display: flex;
  height: 100%;
  width: 100%;
  gap: 2rem;
}

.header-info-colum {
  height: 100%;
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.header-info-colum div {

  border-bottom: 1px solid var(--complementaryColor3);
  height: 100%;
  width: 100%;
}



/* Asegurar que las etiquetas y valores se alineen bien */
.info-label {
  font-weight: bold;
  color: var(--complementaryColor);
  margin-right: 5px;
  /* Espacio entre etiqueta y valor */
  margin-bottom: 2px;
  /* Pequeño espacio entre cada par info */
}

.info-value {
  color: var(--mainColor);
  margin-bottom: 5px;
  /* Espacio debajo de cada valor */
}

.cosplay-info p {
  line-height: 1.5;
  /* Mejor legibilidad */
}

.loading-message {
  text-align: center;
  color: var(--complementaryColor);
  margin-top: 50px;
  font-size: 1.2em;
}
</style>