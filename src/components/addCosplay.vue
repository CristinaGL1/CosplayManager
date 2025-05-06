<template>
    <div>
      <h2>Agregar un nuevo Cosplay</h2>
      <input v-model="nombre" placeholder="Nombre del Cosplay" required />
      <select v-model="estado" required>
      <option value="" disabled>Selecciona un estado</option>
      <option value="En proceso">En proceso</option>
      <option value="Finalizado">Finalizado</option>
      <option value="Sin empezar">Sin empezar</option>
      </select>
      <input v-model="descripcion" placeholder="Descripción" />
      <input v-model="fechaInicio" type="date" />
      <input v-model="fechaFin" type="date" />
      <button @click="agregarCosplay">Guardar</button>

      <div v-if="mostrarMensaje" class="notification">
      {{ mensaje }}
    </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { db } from '../firebase'
  import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
  import { getAuth } from 'firebase/auth'

  const emit = defineEmits(['cosplay-agregado'])
  
  const nombre = ref('')
  const estado = ref('')
  const descripcion = ref('')
  const fechaInicio = ref('')
  const fechaFin = ref('')

  const mensaje = ref(''); // Nuevo ref para el mensaje
  const mostrarMensaje = ref(false); // Nuevo ref para controlar la visibilidad

const agregarCosplay = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
    mensaje.value = 'Debes iniciar sesión';
    mostrarMensaje.value = true;
    setTimeout(() => {
      mostrarMensaje.value = false;
      mensaje.value = '';
    }, 3000); // Mostrar mensaje por 3 segundos
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

  // Validación manual del estado
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

  console.log("Datos del cosplay a agregar:", cosplayData)  // Verifica qué datos estás enviando

  try {
    await addDoc(collection(db, 'cosplays'), cosplayData);
    mensaje.value = 'Cosplay agregado ✅';
    mostrarMensaje.value = true;
    setTimeout(() => {
      mostrarMensaje.value = false;
      mensaje.value = '';
      emit('cosplay-agregado'); // Emitir el evento después de ocultar el mensaje
      // Limpiar los campos
      nombre.value = '';
      estado.value = '';
      descripcion.value = '';
      fechaInicio.value = '';
      fechaFin.value = '';
    }, 3000); // Mostrar mensaje por 3 segundos
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
  background-color: white; /* Fondo blanco */
  color: #999; /* Establecemos el color inicial del texto del select a gris */
  text-align: left; /* Alineamos el texto a la izquierda */

}

select option:disabled {
  color: #999; /* Color gris para la opción deshabilitada (placeholder) */
}

/* Forzamos el color gris cuando la primera opción (disabled) está seleccionada */
select:focus:not(:placeholder-shown) {
  color: #333; /* Cambia a oscuro al seleccionar una opción válida */
}

select:not(:disabled) {
  color: #333; /* Cuando se selecciona una opción válida, el texto será oscuro */
}
input {
  display: block;
  width: 100%;
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  padding-left: 0.8rem; /* Añadimos un poco de padding a la izquierda */
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

button {
  padding: 0.5rem 1rem; /* Reducimos el padding vertical y horizontal */
  margin-top: 0.5rem;
  border: none;
  background-color: #ff69b4;
  color: white;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
  width: auto; /* El ancho se ajustará al contenido */
  font-size: 0.9em; /* Reducimos el tamaño de la fuente del botón */
}

button:hover {
  background-color: #ff85c1;
}

select {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  background-color: white; /* Fondo blanco */
  color: #333; /* Color del texto general */
}

select option:disabled {
  color: #999; /* Color gris para la opción deshabilitada (placeholder) */
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
  