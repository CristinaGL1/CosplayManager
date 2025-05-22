<template>
    <div>
      <h2>Galería de Imágenes</h2>
      <div v-if="images.length > 0" class="image-grid">
        <img :src="image.imagenURL" :alt="image.descripcion" v-for="image in images" :key="image.id">
      </div>
      <p v-else>No hay imágenes en la galería.</p>
  
      </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { db } from '@/firebase'; // Asegúrate de la ruta correcta a tu instancia de Firestore
  import { collection, query, where, getDocs } from 'firebase/firestore';
  import { useRoute } from 'vue-router'; // Si estás usando Vue Router para navegar entre cosplays
  
  const route = useRoute();
  const cosplayId = ref(null);
  const images = ref([]);
  
  onMounted(async () => {
    // Obtener el ID del cosplay de alguna manera (ej: ruta)
    cosplayId.value = route.params.id; // Si estás usando Vue Router con una ruta como /cosplay/:id/gallery
    if (cosplayId.value) {
      await fetchGalleryImages();
    }
  });
  
  async function fetchGalleryImages() {
    const galleryRef = collection(db, 'galeria');
    const q = query(galleryRef, where('cosplayId', '==', cosplayId.value));
    const querySnapshot = await getDocs(q);
    images.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
  
  // Opcional: Funciones para subir imágenes
  // async function uploadImage(event) { ... }
  // async function saveImageDescription() { ... }
  </script>
  
  <style scoped>
  .image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
    margin-top: 15px;
  }
  
  .image-grid img {
    width: 100%;
    height: auto;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  </style>