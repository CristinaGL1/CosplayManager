<template>
  <div class="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md mt-6">
    <h2 class="text-2xl font-bold mb-4">Detalles del Cosplay</h2>

    <div v-if="cosplay">
      <div v-if="!editando" class="space-y-2">
        <h3 class="text-xl font-semibold text-blue-600">{{ cosplay.nombre }}</h3>
        <p><strong>Estado:</strong> {{ cosplay.estado }}</p>
        <p><strong>Descripción:</strong> {{ cosplay.descripcion }}</p>
        <p v-if="cosplay.fechaInicio">
          <strong>Fecha de Inicio:</strong> {{ formatFecha(cosplay.fechaInicio) }}
        </p>
        <p v-if="cosplay.fechaFin">
          <strong>Fecha de Fin:</strong> {{ formatFecha(cosplay.fechaFin) }}
        </p>

        <div v-if="cosplay.imagenUrl">
          <strong>Imagen:</strong>
          <img :src="cosplay.imagenUrl" alt="Imagen del cosplay" class="mt-2 w-64 rounded" />
        </div>
      </div>

      <div v-else class="space-y-4">
        <label>
          Nombre:
          <input v-model="form.nombre" type="text" class="border p-1 w-full" />
        </label>

        <label>
          Estado:
          <select v-model="form.estado" class="border p-1 w-full">
            <option>En proceso</option>
            <option>Terminado</option>
            <option>Pendiente</option>
          </select>
        </label>

        <label>
          Descripción:
          <textarea v-model="form.descripcion" class="border p-1 w-full" rows="3"></textarea>
        </label>

        <label>
          Fecha de Inicio:
          <input v-model="form.fechaInicio" type="date" class="border p-1 w-full" />
        </label>

        <label>
          Fecha de Fin:
          <input v-model="form.fechaFin" type="date" class="border p-1 w-full" />
        </label>

        <label>
          URL Imagen:
          <input v-model="form.imagenUrl" type="text" class="border p-1 w-full" />
        </label>

        <div class="flex gap-4">
          <button
            @click="guardarEdicion"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Guardar
          </button>
          <button
            @click="cancelarEdicion"
            class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-gray-500">Cargando detalles del cosplay...</div>

    <div class="mt-6 flex gap-4">
      <button
        @click="$router.go(-1)"
        class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        Volver
      </button>

      <button
        v-if="cosplay && !editando"
        @click="iniciarEdicion"
        class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
      >
        Editar
      </button>
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
label {
  display: block;
  font-weight: 600;
  margin-top: 10px;
}
input,
select,
textarea {
  margin-top: 4px;
}
</style>
