<template>
  <div>
    <h2>Agregar un nuevo Cosplay</h2>
    <input v-model="nombre" placeholder="Nombre del Cosplay" required />
    <select v-model="estado" required>
      <option value="" disabled>Selecciona un estado</option>
      <option value="Sin empezar">Sin empezar</option>
      <option value="En proceso">En proceso</option>
      <option value="Finalizado">Finalizado</option>
    </select>
    <input v-model="descripcion" placeholder="Descripción" />
    <input v-model="fechaInicio" type="date" />
    <input v-model="fechaFin" type="date" />

    <div class="form-actions">
      <button @click="agregarCosplay">Guardar</button>
      <button @click="$emit('ocultar-formulario')" class="hide-form-button">Ocultar Formulario</button>
    </div>

    <div v-if="mostrarMensaje" class="notification">
      {{ mensaje }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const emit = defineEmits(['cosplay-agregado', 'ocultar-formulario']);

const nombre = ref('');
const estado = ref('');
const descripcion = ref('');
const fechaInicio = ref('');
const fechaFin = ref('');

const mensaje = ref('');
const mostrarMensaje = ref(false);

const agregarCosplay = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
    mensaje.value = 'Debes iniciar sesión';
    mostrarMensaje.value = true;
    setTimeout(() => {
      mostrarMensaje.value = false;
      mensaje.value = '';
    }, 3000);
    return;
  }
  if (!nombre.value.trim()) {
    mensaje.value = 'El nombre del cosplay es obligatorio.';
    mostrarMensaje.value = true;
    setTimeout(() => {
      mostrarMensaje.value = false;
      mensaje.value = '';
    }, 3000);
    return;
  }

  if (!estado.value) {
    mensaje.value = 'Por favor, selecciona un estado.';
    mostrarMensaje.value = true;
    setTimeout(() => {
      mostrarMensaje.value = false;
      mensaje.value = '';
    }, 3000);
    return;
  }

  const cosplayData = {
    nombre: nombre.value,
    estado: estado.value,
    descripcion: descripcion.value,
    fechaInicio: fechaInicio.value,
    fechaFin: fechaFin.value,
    userId: user.uid,
    creadoEn: serverTimestamp()
  }

  console.log("Datos del cosplay a agregar:", cosplayData)

  try {
    await addDoc(collection(db, 'cosplays'), cosplayData);
    mensaje.value = 'Cosplay agregado ✅';
    mostrarMensaje.value = true;
    setTimeout(() => {
      mostrarMensaje.value = false;
      mensaje.value = '';
      emit('cosplay-agregado');
      nombre.value = '';
      estado.value = '';
      descripcion.value = '';
      fechaInicio.value = '';
      fechaFin.value = '';
      emit('ocultar-formulario');
    }, 3000);
  } catch (error) {
    console.error('Error al agregar cosplay:', error);
    mensaje.value = 'Error al agregar el cosplay.';
    mostrarMensaje.value = true;
    setTimeout(() => {
      mostrarMensaje.value = false;
      mensaje.value = '';
    }, 3000);
  }
};
</script>

<style scoped>
select {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  background-color: white;
  color: #999;
  text-align: left;
}

select option:disabled {
  color: #999;
}

select:focus:not(:placeholder-shown) {
  color: #333;
}

select:not(:disabled) {
  color: #333;
}

input {
  display: block;
  width: 100%;
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  padding-left: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  justify-content: center; /* Asegúrate de tener esta línea */
  align-items: center; /* Esto alinea verticalmente si fuera necesario */
}

.form-actions button {
  padding: 0.4rem 1rem;
  border: none; /* Aseguramos que no haya borde */
  background-color: #f7ecf2; /* Color rosa de fondo */
  color: black; /* Texto negro */
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 0.7rem;
}

.form-actions button:hover {
  background-color: #ffdef0; /* Rosa más claro al pasar el ratón */
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