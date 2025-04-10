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

      <!-- Aquí puedes añadir tu componente AgregarCosplay o el formulario directamente -->
      <AddCosplay /> 

     <!-- <form>
        <input type="text" placeholder="Nombre del cosplay" />
        <button>Guardar cosplay</button>
      </form> -->

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

  const email = ref('')
  const password = ref('')
  const loginEmail = ref('')
  const loginPassword = ref('')
  const userLogged = ref(false) 

  //Nuevo contenido
  onMounted(() => { 
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // El usuario está autenticado
      userLogged.value = true
    } else {
      // El usuario no está autenticado
      userLogged.value = false
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
  