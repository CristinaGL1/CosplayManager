<template>
    <div>
      <h2>Detalles del Cosplay</h2>
      <div v-if="cosplay">
        <h3>{{ cosplay.nombre }}</h3>
        <p>Estado: {{ cosplay.estado }}</p>
        <p>Descripción: {{ cosplay.descripcion }}</p>
        <p v-if="cosplay.fechaInicio">Fecha de Inicio: {{ cosplay.fechaInicio }}</p>
        <p v-if="cosplay.fechaFin">Fecha de Fin: {{ cosplay.fechaFin }}</p>
        </div>
      <div v-else>
        Cargando detalles del cosplay...
      </div>
      <button @click="$router.go(-1)">Volver</button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { db } from '../firebase';
  import { doc, getDoc } from 'firebase/firestore';
  import { useRoute, useRouter } from 'vue-router';
  
  const route = useRoute();
  const router = useRouter();
  const cosplayId = route.params.id;
  const cosplay = ref(null);
  
  onMounted(async () => {
    if (cosplayId) {
      const docRef = doc(db, 'cosplays', cosplayId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        cosplay.value = { id: docSnap.id, ...docSnap.data() };
        console.log("Datos del cosplay:", cosplay.value);
      } else {
        console.log("No existe el documento!");
        // Podrías redirigir a una página de error
      }
    }
  });
  </script>