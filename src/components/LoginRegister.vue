<template>
  <div>
    <template v-if="!userLogged">
      <!-- FORMULARIO DE REGISTRO-->
      <h2>Registrarse</h2>
      <input type="email" v-model="email" placeholder="correo" />
      <input type="password" v-model="password" placeholder="Contraseña" />
      <button @click="register">Registrarse</button>
      <!-- FOEMULARIO DE LOGIN-->
      <h2>Iniciar sesión</h2>
      <input type="email" v-model="loginEmail" placeholder="Correo" />
      <input type="password" v-model="loginPassword" placeholder="Contraseña" />
      <button @click="login">Iniciar sesión</button>
    </template>

    <template v-else>
      <h2>Bienvenido/a 🎉</h2>
      <p>Ahora puedes agregar tus cosplays:</p>

      <AddCosplay />
      <CosplayList :cosplays="cosplayList" /> <!-- Asegúrate de pasar la lista de cosplays como prop -->

      <!-- Lista de cosplays -->
     <!-- <h3>Mis cosplays guardados</h3>
      <ul>
        <li v-for="cosplay in cosplayList" :key="cosplay.id">
          <strong>{{ cosplay.name }}</strong> - {{ cosplay.status }} - {{ cosplay.cost }}€
          <br />
          <img :src="cosplay.imageURL" :alt="cosplay.name" width="100" />
        </li>
      </ul> -->
    

      <button @click="logout" style="margin-top: 20px; background: white; color: black;">
        Cerrar sesión
      </button>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'

import AddCosplay from './addCosplay.vue'
import { getCosplays } from '../firestore' 
import CosplayList from './cosplayList.vue' // 👈 Importa el componente


const email = ref('')
const password = ref('')
const loginEmail = ref('')
const loginPassword = ref('')
const userLogged = ref(false)
const cosplayList = ref([])


let cosplaysLoaded = false  // Nueva variable de control

const loadCosplays = async () => {
  if (!cosplaysLoaded) { // Solo cargar si no se ha cargado aún
    cosplayList.value = await getCosplays()
    cosplaysLoaded = true  // Marcar como cargado
  }
}

//Nuevo contenido
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // El usuario está autenticado
      userLogged.value = true
      loadCosplays() // 🔥 cargar la lista cuando se loguea
    } else {
      // El usuario no está autenticado
      userLogged.value = false
     cosplayList.value = [] // limpiar la lista si se desloguea
    }
  })
})

const login = async () => {
  if (!loginEmail.value || !loginPassword.value) {
    alert("Por favor, escribe correo y contraseña")
    return
  }

  try {
    await signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value)
    alert('Has iniciado sesión ✅')
    userLogged.value = true
  } catch (error) {
    alert('Error al iniciar sesión: ' + error.message)
  }
}

const register = async () => {
  if (!email.value || !password.value) {
    alert("Por favor, completa los campos para registrarte")
    return
  }

  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value)
    alert('Registro exitoso 🎉')
    userLogged.value = true
  } catch (error) {
    alert('Error al registrarse: ' + error.message)
  }
}
const logout = async () => {
  await signOut(auth)
  userLogged.value = false
  alert("Sesión cerrada")
}

</script>