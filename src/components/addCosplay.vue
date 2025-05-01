<template>
    <div>
      <h2>Agregar un nuevo Cosplay</h2>
      <input v-model="nombre" placeholder="Nombre del Cosplay" required />
      <input v-model="estado" placeholder="Estado" />
      <input v-model="descripcion" placeholder="Descripción" />
      <input v-model="fechaInicio" type="date" />
      <input v-model="fechaFin" type="date" />
      <button @click="agregarCosplay">Guardar</button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { db } from '../firebase'
  import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
  import { getAuth } from 'firebase/auth'
  
  const nombre = ref('')
  const estado = ref('')
  const descripcion = ref('')
  const fechaInicio = ref('')
  const fechaFin = ref('')
  
  const agregarCosplay = async () => {
    const auth = getAuth()
    const user = auth.currentUser
    if (!user) {
      alert('Debes iniciar sesión')
      return
    }
     // Verificar si el nombre está vacío
    if (!nombre.value.trim()) {
      alert('El nombre del cosplay es obligatorio.')
      return // Detiene la función si el nombre está vacío
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
    await addDoc(collection(db, 'cosplays'), cosplayData)
    alert('Cosplay agregado ✅')
    // Limpiar los campos
    nombre.value = ''
    estado.value = ''
    descripcion.value = ''
    fechaInicio.value = ''
    fechaFin.value = ''
  } catch (error) {
    console.error('Error al agregar cosplay:', error)
  }
}
  </script>
  