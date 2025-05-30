<template>
  <div class="container">
    <div class="login-page" v-if="!userLogged">
      <template v-if="!showRegister">
        <div class="form-box login-box">
          <div class="form-box-bg"></div>
          <h2>Iniciar sesión</h2>
          <div class="formInputs">
            <input type="email" v-model="loginEmail" placeholder="Correo" />
            <input type="password" v-model="loginPassword" placeholder="Contraseña" />
          </div>
          <button class="registerButton" @click="login">Iniciar sesión</button>
          <p class="register-link">
            ¿No tienes cuenta? <a href="#" @click.prevent="showRegister = true">Regístrate aquí</a>
          </p>
        </div>
      </template>
      <template v-else>
        <div class="form-box register-box">
          <div class="form-box-bg"></div>
          <h2>Regístrate</h2>
          <div class="formInputs">
            <input type="email" v-model="email" placeholder="Correo" />
            <input type="password" v-model="password" placeholder="Contraseña" />
          </div>
          <button class="registerButton" @click="register">Registrarse</button>
          <p class="login-link">
            ¿Ya tienes cuenta? <a href="#" @click.prevent="showRegister = false">Inicia sesión</a>
          </p>
        </div>
      </template>
    </div>
    <div v-else class="cosplay-area">
      <AddCosplay v-if="showAddCosplay" @cosplay-agregado="loadCosplays" @ocultar-formulario="showAddCosplay = false" />
      <CosplayList :cosplays="cosplayList" @cosplay-eliminado="handleCosplayEliminado" />
    </div>
    <div v-if="mostrarMensajeLogout" class="notification">
      {{ mensajeLogout }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import AddCosplay from '../components/addCosplay.vue';
import { getCosplays } from '../firestore';
import CosplayList from '../components/cosplayList.vue';
import { useRouter } from 'vue-router';
import axios from 'axios';


const email = ref('');
const password = ref('');
const loginEmail = ref('');
const loginPassword = ref('');
const userLogged = ref(false);
const cosplayList = ref([]);
const showRegister = ref(false);
const showAddCosplay = ref(false);
const mensajeLogout = ref('');
const mostrarMensajeLogout = ref(false);
const router = useRouter();
const mysqlUserId = ref(null);


const loadCosplays = async (userId) => {
  if (!userId) {
    console.warn('No se proporcionó userId para cargar cosplays.');
    cosplayList.value = [];
    return;
  }
  cosplayList.value = await getCosplays(userId);
};

onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, async (user) => {
    userLogged.value = !!user;
    if (user) {
      try {
        const token = await user.getIdToken();
        const response = await axios.get('http://localhost:3000/api/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        mysqlUserId.value = response.data.id;
        loadCosplays(mysqlUserId.value);
       router.push({ path: '/cosplayLanding', query: { userId: mysqlUserId.value } });
      } catch (error) {
        console.error('Error al obtener userId en onMounted:', error);
        // Podrías manejar el error aquí
      }
    } else {
      cosplayList.value = []; // Limpiar la lista si no hay usuario logueado
    }
  });
});

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
    const userCredential = await signInWithEmailAndPassword(getAuth(), loginEmail.value, loginPassword.value);
    const user = userCredential.user;
    if (user) {
      const token = await user.getIdToken();
      try {
        const response = await axios.get('http://localhost:3000/api/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        mysqlUserId.value = response.data.id;
        console.log('ID de MySQL del usuario:', mysqlUserId.value);
        loadCosplays(mysqlUserId.value);
        mensajeLogout.value = 'Has iniciado sesión ✅';
        mostrarMensajeLogout.value = true;
        setTimeout(() => {
          mostrarMensajeLogout.value = false;
          mensajeLogout.value = '';
          // Eliminamos la redirección de aquí
        }, 3000);
      } catch (error) {
        console.error('Error al obtener userId de MySQL:', error);
        alert('Error al iniciar sesión completamente.');
      }
    }
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
    const authResult = await createUserWithEmailAndPassword(getAuth(), email.value, password.value);
    const user = authResult.user;
    if (user) {
      console.log('Intentando registrar usuario en el backend:', { firebaseUid: user.uid, email: email.value });
      const response = await axios.post('http://localhost:3000/api/users', {
        firebaseUid: user.uid,
        email: email.value
      });
      console.log('Usuario registrado en el backend:', response.data);
      mensajeLogout.value = 'Registro exitoso 🎉';
      mostrarMensajeLogout.value = true;
      setTimeout(() => {
        mostrarMensajeLogout.value = false;
        mensajeLogout.value = '';
        showRegister.value = false;
      }, 3000);
    }
  } catch (error) {
    alert('Error al registrarse en Firebase: ' + error.message);
  }
};

const logout = async () => {
  await signOut(getAuth());
  mensajeLogout.value = "Sesión cerrada";
  mostrarMensajeLogout.value = true;
  cosplaysLoaded = false;
  setTimeout(() => {
    mostrarMensajeLogout.value = false;
    mensajeLogout.value = '';
    router.push('/'); // Redirigir al login al cerrar sesión
  }, 100); // Reducción del tiempo para probar más rápido
};

const handleCosplayEliminado = (idEliminado) => {
  cosplayList.value = cosplayList.value.filter(cosplay => cosplay.id !== idEliminado);
};
</script>

<style scoped>
/* Estilos relacionados SOLO con el login y registro */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* Centra horizontalmente */
  width: 100%;
  padding-top: 8rem;
  /* Ajusta el espacio superior si es necesario */
  box-sizing: border-box;
}

.login-page {
  padding: 2rem;
  max-width: 300px;
  width: 90%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-box {
  background-color: white;
  padding: 2rem;
  margin-bottom: 1rem;
  width: 25rem;
  height: 17rem;
  border: 2px solid #000000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  transition: box-shadow 0.3s ease;
  border-radius: 10px;
  /* Añado esto */

}

.form-box h2 {
  font-family: 'Poppins', sans-serif;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 1.3rem;
  color: #000000;
}

.formInputs {
  width: 100%;
  margin-bottom: 0.5rem;
  border-radius: 10px;
  /* Añado esto */
}

.form-box-bg {
  border: 2px solid black;
  background-color: #fcebf8;
  position: absolute;
  height: 100%;
  width: 100%;
  top: 15px;
  left: 15px;
  z-index: -1;
  transition: background-color 0.25s ease, top 0.25s ease, left 0.25s ease;
  border-radius: 10px;
  /* Añad esto */
}

.form-box:hover .form-box-bg {
  background-color: #d1fffd;
  top: 18px;
  left: 18px
}

input {
  display: block;
  width: 100%;
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  border: 1px solid #000000;
  font-size: 1rem;
  border-radius: 10px;
  /*añado estp */
}

.registerButton {
  padding: 0.5rem 1rem;
  border: 1px solid #888;
  background-color: #f7ecf2;
  color: #000000;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  width: auto;
  font-size: 0.9em;
  border-radius: 10px;
  /* Añado esto*/
}

.registerButton:hover {
  background-color: #ffdef0;
}

.register-link,
.login-link {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.8rem;
}

.register-link a,
.login-link a {
  color: #ff73c5;
  text-decoration: none;
  margin-top: 0.25rem;
  transition: background-color 0.3s ease;
}

.register-link a:hover,
.login-link a:hover {
  background-color: #fae6f6;
  text-decoration: underline;
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