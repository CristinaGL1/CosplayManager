<template>
  <form @submit.prevent="addcosplay">
    <div class="add-cosplay-overlay" @click.self="$emit('ocultar-formulario')">
      <div class="add-cosplay-form-container">
        <h2>Agregar un nuevo Cosplay</h2>

        <div>
          <label for="nombre-cosplay">Nombre:</label>
          <input id="nombre-cosplay" v-model="nombre" placeholder="Nombre del Cosplay" required />
        </div>

        <div>
          <label for="estado-cosplay">Estado:</label>
          <select id="estado-cosplay" v-model="estado">
            <option value="">Selecciona un estado</option>
            <option value="Sin empezar">Sin empezar</option>
            <option value="En proceso">En proceso</option>
            <option value="Finalizado">Finalizado</option>
          </select>
        </div>

        <div>
          <label for="descripcion-cosplay">Descripción:</label>
          <textarea id="descripcion-cosplay" v-model="descripcion" placeholder="Descripción"></textarea>
        </div>

        <div>
          <label for="fecha-inicio-cosplay">Fecha de Inicio:</label>
          <input id="fecha-inicio-cosplay" v-model="fechaInicio" type="date" />
        </div>

        <div>
          <label for="fecha-fin-cosplay">Fecha de Fin:</label>
          <input id="fecha-fin-cosplay" v-model="fechaFin" type="date" />
        </div>

        <div>
          <label for="imagen-cosplay">Subir Imagen:</label>
          <input type="file" id="imagen-cosplay" @change="handleImageUpload" ref="imageInput">
        </div>
        <div class="form-actions">
          <button @click="$emit('ocultar-formulario')" class="hide-form-button">Ocultar Formulario</button>
          <input type="submit" value="Guardar"></input>
        </div>

      </div>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie'

const emit = defineEmits(['cosplay-agregado', 'ocultar-formulario']);

const nombre = ref('');
const estado = ref('');
const descripcion = ref('');
const fechaInicio = ref('');
const fechaFin = ref('');

const imagenArchivo = ref(null); // Aquí se guarda el objeto File
const imageInput = ref(null); // Ref para el input de tipo file, para poder resetearlo


const handleImageUpload = (event) => {
  imagenArchivo.value = event.target.files[0];
  console.log('Archivo de imagen seleccionado:', imagenArchivo.value);
};

async function addcosplay() {
  // 1. Crear un objeto FormData
  const formData = new FormData();

  // 2. Añadir todos los campos de texto al FormData
  formData.append('nombre', nombre.value);
  formData.append('estado', estado.value);
  formData.append('descripcion', descripcion.value);

  // Manejar fechas que pueden ser nulas
  formData.append('fechaInicio', fechaInicio.value || ''); // Envía cadena vacía si es null
  formData.append('fechaFin', fechaFin.value || '');       // El backend debe convertir '' a NULL

  formData.append('userId', Cookies.get('userID'));

  // 3. Añadir el archivo de imagen al FormData
  // La clave 'imagenCosplay' DEBE COINCIDIR con el nombre del campo que Multer espera en tu backend (upload.single('imagenCosplay'))
  if (imagenArchivo.value) {
    formData.append('imagenCosplay', imagenArchivo.value, imagenArchivo.value.name);
  }

  try {
    // 4. Enviar el FormData con Axios
    // Axios automáticamente establecerá el 'Content-Type' a 'multipart/form-data'
    // cuando detecta que le pasas un objeto FormData.
    const response = await axios.post('http://localhost:3000/addCosplay', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Respuesta del servidor:', response.data);

    // Limpiar los campos y el input de archivo después del registro exitoso
    nombre.value = '';
    estado.value = '';
    descripcion.value = '';
    fechaInicio.value = '';
    fechaFin.value = '';
    imagenArchivo.value = null; // Borrar el archivo de la referencia
    if (imageInput.value) {
      imageInput.value.value = ''; // Esto limpia visualmente el input de tipo 'file'
    }

    // Recargar la página si es necesario, o emitir un evento
    window.location.reload();
    // emit('cosplay-agregado'); // Si prefieres no recargar la página completa

  } catch (error) {
    console.error('Error de registro:', error.response?.data?.message || error.message);
    // Aquí puedes mostrar un mensaje de error al usuario
  }
}


</script>


<style scoped>
.add-cosplay-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;  
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  /* Oscurece más el fondo para que el modal resalte */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1010;
  padding-left: 18vw;
  padding-right: 1vw;
  padding-top: 10vh;
  padding-bottom: 3vh;
  box-sizing: border-box;
}

.add-cosplay-form-container {
  background-color: var(--mainColor);
  /* Fondo del modal */
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
   font-family: 'Arial', sans-serif;
  padding: 25px;
  width: 102%;
  height: 99%;
  max-width: 1200px;
  max-height: 1000px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  justify-content: space-between;
    border: 2px solid var(--secondaryColor);
}

h2 {
  text-align: center;
  font-weight: bolder;
  font-size: 25px;
  color: var(--secondaryColor);
  /* Color del título */
  margin-bottom: 20px;
  
}

label {
  display: block;
  font-weight: bold;
  color: var(--secondaryColor);
  /* Color de las etiquetas */
  margin-bottom: 0px;
}

/* *** MODIFICACIÓN CLAVE AQUÍ: Invertir colores para inputs y textareas *** */
input[type="text"],
input[type="date"],
textarea,
#nombre-cosplay {
  width: 100%;
  padding: 10px;
  margin-top: 2px;
  border: 1px solid var(--secondaryColor);
  border-radius: 6px;
  box-sizing: border-box;
  font-size: 1em;
  background-color: var(--modalNuevo);

  color: var(--modalRellenoColor);
  
}

/* Estilos para el select del estado */
select {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: none;
  border-radius: 8px;
  box-sizing: border-box;
  font-size: 1em;
  border: 1px solid var(--secondaryColor);
  background-color: var(--modalNuevo); 
  color: var(--modalRellenoColor); 
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><path fill="currentColor" d="M4.5 4l3 3 3-3z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 12px;
}
/* Estilo para las opciones dentro del select (puede variar la implementación del navegador) */
select option {
  background-color: var(--modalRellenoColor);
  /* Fondo de las opciones */
  color: var(--mainColor);
  /* Color del texto de las opciones */
}


/* Estilos específicos para el input de tipo file */
input[type="file"] {
  width: 100%;
  padding: 0;
  margin-top: 5px;
  border: none;
  background-color: transparent;
  box-sizing: border-box;
  font-size: 1em;
  color: var(--mainColor);
  /* Color del texto "Ningún archivo seleccionado" */
}

input[type="file"]::file-selector-button {
  background-color: var(--modalNuevo);
  color: var(--secondaryColor);
  padding: 0.5rem 1rem;
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

input[type="file"]::file-selector-button:hover {
  background-color: var(--complementaryColor);
  color: var(--modalColor);
  transform: translateY(-2px);
}


/* Estilos de enfoque para inputs, selects y textareas */
input:focus,
select:focus,
/* Aseguramos que el select también tenga el foco del color */
textarea:focus {
  border-color: var(--secondaryColor);
  box-shadow: 0 0 0 3px rgba(183, 162, 201, 0.3);
  outline: none;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

.form-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.form-actions input[type="submit"],
.form-actions button {
  padding: 0.5rem 0.9rem;
  border: none;
  background-color: var(--modalNuevo);
  color: var(--secondaryColor);
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  font-size: 0.90em;
  border-radius: 8px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  line-height: normal;
}

.form-actions input[type="submit"]:hover,
.form-actions button:hover {
  background-color: var(--complementaryColor);
  color: var(--modalColor);
  transform: translateY(-2px);
}

input::placeholder,
textarea::placeholder {
  color: var(--complementaryColor3);
  opacity: 0.8;
}
</style>