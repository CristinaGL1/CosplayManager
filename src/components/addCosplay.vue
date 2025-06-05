<template>
  <form @submit.prevent="addcosplay">
    <div class="add-cosplay-overlay" @click.self="$emit('ocultar-formulario')">
      <div class="add-cosplay-form-container">
        <h2>Agregar un nuevo Cosplay</h2>
        <input v-model="nombre" placeholder="Nombre del Cosplay" required />
        <select v-model="estado">
          <option value="">Selecciona un estado</option>
          <option value="Sin empezar">Sin empezar</option>
          <option value="En proceso">En proceso</option>
          <option value="Finalizado">Finalizado</option>
        </select>
        <input v-model="descripcion" placeholder="Descripción" />
        <input v-model="fechaInicio" type="date" />
        <input v-model="fechaFin" type="date" />

        <div>
          <label for="imagen">Imagen:</label>
          <input type="file" id="imagen" @change="handleImageUpload">
        </div>

        <div class="form-actions">
          <input type="submit" @click="agregarCosplay" value="Guardar"></input>
          <button @click="$emit('ocultar-formulario')" class="hide-form-button">Ocultar Formulario</button>
        </div>

      </div>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const emit = defineEmits(['cosplay-agregado', 'ocultar-formulario']);

const nombre = ref('');
const estado = ref('');
const descripcion = ref('');
const fechaInicio = ref('');
const fechaFin = ref('');

const mensaje = ref('');
const mostrarMensaje = ref(false);
const imagenArchivo = ref(null); // Nuevo ref para el archivo de imagen

const handleImageUpload = (event) => {
  imagenArchivo.value = event.target.files[0];
  console.log('Archivo de imagen seleccionado:', imagenArchivo.value);
};

async function addcosplay() {

  const payload = {
  };

  if(fechaInicio.value == ''){
    fechaInicio.value = null
  }

   if(fechaFin.value == ''){
    fechaFin.value = null
  }

  try {
    const response = await axios.post('http://localhost:3000/addcosplay', {
      nombre: nombre.value,
      estado: estado.value,
      descripcion: descripcion.value,
      fechaInicio: fechaInicio.value,
      fechaFin: fechaFin.value,
      userId: localStorage.userId,
      // imagenURL: imagenURL.value

    });

    // Limpiar los campos después del registro exitoso
    nombre.value;
    estado.value;
    descripcion.value;
    fechaInicio.value;
    fechaFin.value;
    // imagenURL.value;

    window.location.reload()

  } catch (error) {
    console.error('Error de registro:', error);

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

.add-cosplay-form-container {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  font-family: 'Arial', sans-serif;
  /* O la fuente que uses */
  padding: 30px;
  width: 102%;
  max-width: 1200px;
  /* Ajusta si es necesario */
  max-height: 1000px;
  /* Ajusta si es necesario */
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
}

h2.detail-title {
  font-size: 2em;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  text-align: center;
}

label {
  display: block;
  font-weight: bold;
  color: #333;
  margin-top: 10px;
}

input[type="text"],
input[type="date"],
select,
textarea,
input[type="file"] {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
  font-size: 1em;
}

textarea {
  min-height: 80px;
}

.form-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.form-actions button {
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

.form-actions button:hover {
  background-color: #ffdef0;
}

.notification {
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.8rem 1.2rem;
  border-radius: 5px;
  margin-bottom: 1rem;
  z-index: 1001;
}
</style>
