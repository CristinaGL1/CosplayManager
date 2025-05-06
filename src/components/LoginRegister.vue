<template>
  <div class="container">
    <h1 class="app-title">Cosplay Manager</h1>
    <div class="login-page" v-if="!userLogged">
      <template v-if="!showRegister">
        <div class="form-box login-box">
          <h2>Iniciar sesión</h2>
          <input type="email" v-model="loginEmail" placeholder="Correo" />
          <input type="password" v-model="loginPassword" placeholder="Contraseña" />
          <button @click="login">Iniciar sesión</button>
          <p class="register-link">
            ¿No tienes cuenta? <a href="#" @click.prevent="showRegister = true">Regístrate aquí</a>
          </p>
        </div>
      </template>
      <template v-else>
        <div class="form-box register-box">
          <h2>Regístrate</h2>
          <input type="email" v-model="email" placeholder="Correo" />
          <input type="password" v-model="password" placeholder="Contraseña" />
          <button @click="register">Registrarse</button>
          <p class="login-link">
            ¿Ya tienes cuenta? <a href="#" @click.prevent="showRegister = false">Inicia sesión</a>
          </p>
        </div>
      </template>
    </div>
    <div v-else class="cosplay-area">
      <button @click="showAddCosplay = !showAddCosplay">
        {{ showAddCosplay ? 'Ocultar Formulario' : 'Agregar Nuevo Cosplay' }}
      </button>
      <AddCosplay v-if="showAddCosplay" @cosplay-agregado="loadCosplays" />
    
      <CosplayList :cosplays="cosplayList" @cosplay-eliminado="handleCosplayEliminado" />
      <button @click="logout" class="logout-button">Cerrar sesión</button>
    </div>
    <div v-if="mostrarMensajeLogout" class="notification">
      {{ mensajeLogout }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import AddCosplay from './addCosplay.vue'
import { getCosplays } from '../firestore'
import CosplayList from './cosplayList.vue'


const email = ref('')
const password = ref('')
const loginEmail = ref('')
const loginPassword = ref('')
const userLogged = ref(false)
const cosplayList = ref([])
const showRegister = ref(false) // Nuevo estado para controlar qué formulario mostrar
const showAddCosplay = ref(false) // Nuevo estado para mostrar/ocultar el formulario de agregar


const mensajeLogout = ref(''); // Añade esta línea
const mostrarMensajeLogout = ref(false); // Añade esta línea

let cosplaysLoaded = false

const loadCosplays = async () => {
  console.log('Intentando cargar cosplays...');
  if (!cosplaysLoaded) {
    cosplayList.value = await getCosplays()
    console.log('Cosplays cargados:', cosplayList.value);
    cosplaysLoaded = true
  } else {
    // Si ya se cargaron, solo recargamos para la actualización
    cosplayList.value = await getCosplays();
    console.log('Recargando cosplays:', cosplayList.value);
  }
}

onMounted(() => {
  const auth = getAuth()
  onAuthStateChanged(auth, (user) => {
    userLogged.value = !!user;
    if (user) {
      loadCosplays()
    }
  })
})

const login = async () => {
  if (!loginEmail.value || !loginPassword.value) {
    mensajeLogout.value = "Por favor, escribe correo y contraseña";
    mostrarMensajeLogout.value = true;
    setTimeout(() => {
      mostrarMensajeLogout.value = false;
      mensajeLogout.value = '';
    }, 3000);
    return;
  }
  try {
    await signInWithEmailAndPassword(getAuth(), loginEmail.value, loginPassword.value);
    mensajeLogout.value = 'Has iniciado sesión ✅';
    mostrarMensajeLogout.value = true;
    setTimeout(() => {
      mostrarMensajeLogout.value = false;
      mensajeLogout.value = '';
      userLogged.value = true; // Asegúrate de tener esta línea aquí
      console.log('Usuario logueado:', userLogged.value);
    }, 3000);
  } catch (error) {
    alert('Error al iniciar sesión: ' + error.message);
  }
};

const register = async () => {
  if (!email.value || !password.value) {
    mensajeLogout.value = "Por favor, completa los campos para registrarte";
    mostrarMensajeLogout.value = true;
    setTimeout(() => {
      mostrarMensajeLogout.value = false;
      mensajeLogout.value = '';
    }, 3000);
    return;
  }
  try {
    await createUserWithEmailAndPassword(getAuth(), email.value, password.value);
    mensajeLogout.value = 'Registro exitoso 🎉';
    mostrarMensajeLogout.value = true;
    setTimeout(() => {
      mostrarMensajeLogout.value = false;
      mensajeLogout.value = '';
      showRegister.value = false; // Volver al inicio de sesión tras registrarse
    }, 3000);
  } catch (error) {
    alert('Error al registrarse: ' + error.message);
  }
};

const logout = async () => {
  await signOut(getAuth());
  mensajeLogout.value = "Sesión cerrada";
  mostrarMensajeLogout.value = true;
  cosplaysLoaded = false; // Resetear la bandera al cerrar sesión
  setTimeout(() => {
    mostrarMensajeLogout.value = false;
    mensajeLogout.value = '';
  }, 3000);
};

const handleCosplayEliminado = (idEliminado) => {
  cosplayList.value = cosplayList.value.filter(cosplay => cosplay.id !== idEliminado);
};

</script>

<style>
body {
  margin: 0;
/*padding-left:500px; */
  background: linear-gradient(to right, #ffdee9, #b5fffc);
  font-family: 'Poppins', sans-serif;
  color: black;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content:center;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.app-title {
  font-size: 4em;
  margin-top: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  white-space: nowrap;
  font-family: 'Pacifico', cursive;
  font-weight: normal;
  margin-top: -10px;
}

.login-page {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 300px;
  width: 90%;
  margin-top: -30px;
}

.form-box {
  background-color: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  width: 120%;
  margin-bottom: 1rem;
  border: 1px solid #eee;
  transition: box-shadow 0.3s ease;
  display: flex; /* Convertimos el form-box en un contenedor flex */
  flex-direction: column; /* Alineamos los elementos verticalmente */
  align-items: center; /* Centramos horizontalmente los elementos hijos */
}

.form-box h2 {
  font-family: 'Poppins', sans-serif;
  font-weight: bold;
  margin-top: 0;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 1.1rem;
  color: #333;
}

.form-box:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

input {
  display: block;
  width: 100%;
  margin-bottom: 0.75rem;
  padding: 0.5rem;
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

.register-link, .login-link {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.8rem;
}

.register-link a, .login-link a {
  color: #ff69b4;
  text-decoration: none;
  font-weight: bold;
  margin-top: 0.25rem;
}

.register-link a:hover, .login-link a:hover {
  text-decoration: underline;
}

.logout-button {
  margin-top: 2rem;
  background-color: white;
  color: black;
  border: 2px solid #ff69b4;
}
.cosplay-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  width: 90%;
  max-width: 800px; /* Ajusta el ancho máximo según necesites */
}

.cosplay-area button {
  padding: 0.5rem 1.5rem;
  margin-bottom: 1rem;
  border: none;
  background-color: #70b2f8; /* Un color azul para el botón */
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

.cosplay-area button:hover {
  background-color: #0056b3;
}

.cosplay-area h2 {
  margin-top: 2rem;
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