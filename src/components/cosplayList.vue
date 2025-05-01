<template>
    <div>
      <h2>Listado de Cosplays</h2>
      <ul>
        <li v-for="cosplay in cosplays" :key="cosplay.id">
          <strong>{{ cosplay.nombre }}</strong> - {{ cosplay.estado }} - {{ cosplay.descripcion }}
          <div v-if="cosplay.imagenURL">
            <img :src="cosplay.imagenURL" alt="Imagen del cosplay" width="100" />
          </div>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  defineProps({
    cosplays: {
      type: Array,
      required: true
    }
  })
  </script>
  