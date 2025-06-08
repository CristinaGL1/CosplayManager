<template>
  <NavigationBar />
  <div class="container">
    <div class="login-page" v-if="!userLogged">

      <template v-if="!showRegister">
        <form @submit.prevent="login">
          <div class="form-box login-box">
            <div class="form-box-bg"></div>
            <h2>Iniciar sesión</h2>
            <div class="formInputs">
              <input class="inputStyle" type="email" v-model="loginEmail" placeholder="Correo" required />
              <input class="inputStyle" type="password" v-model="loginPassword" placeholder="Contraseña" required />
            </div>
            <button type="submit" class="registerButton">Iniciar sesión</button>
            <p class="register-link">¿No tienes cuenta? <a href="#" @click.prevent="showRegister = true">Regístrate
                aquí</a>
            </p>
            <div v-if="loginMessage" class="mt-2 text-sm" :class="loginError ? 'text-red-500' : 'text-green-500'">
              {{ loginMessage }}
            </div>
          </div>
        </form>
      </template>

      <template v-else>
        <form @submit.prevent="register">
          <div class="form-box login-box">
            <div class="form-box-bg"></div>
            <h2>Regístrate</h2>
            <div class="formInputs">
              <input class="inputStyle" type="email" v-model="email" placeholder="Correo" required />
              <input class="inputStyle" type="password" v-model="password" placeholder="Contraseña" required />
            </div>
            <button type="submit" class="registerButton" value="Registrarse">Registrarse</button>
            <p class="login-link">¿Ya tienes cuenta? <a href="#" @click.prevent="showRegister = false">Inicia sesión</a>
            </p>
            <div v-if="registrationMessage" class="mt-2 text-sm"
              :class="registrationError ? 'text-red-500' : 'text-green-500'">
              {{ registrationMessage }}
            </div>
          </div>
        </form>
      </template>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import NavigationBar from '../components/NavigationBar.vue';
import Cookies from 'js-cookie' // IMPORTAR LA LIBRERIA DE COOKIES


const router = useRouter();

const email = ref('');
const password = ref('');
const loginEmail = ref('');
const loginPassword = ref('');
const userLogged = ref(false);
const showRegister = ref(false);
const registrationMessage = ref('');
const registrationError = ref(false);

const loginMessage = ref('');
const loginError = ref(false);

function searchCookie() {

  if (Cookies.get('userID') != null || Cookies.get('userID') != undefined) {
    router.push('/cosplaylanding');
  }
}

searchCookie();

async function login() {
  try {
    const response = await axios.post('http://localhost:3000/login', {
      email: loginEmail.value,
      password: loginPassword.value
    });
    loginMessage.value = response.data.message || 'Inicio de sesión exitoso.';
    loginError.value = false;
    userLogged.value = true;
    console.log('Login exitoso:', response.data);

    //Guardar el user en una Cookie
    Cookies.set('userID', response.data.userId, { expires: 7 }); // 7 días
    router.push('/cosplaylanding');


  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    loginError.value = true;
    loginMessage.value = error.response?.data?.message || 'Credenciales inválidas.';
  }
}

async function register() {
  try {
    const response = await axios.post('http://localhost:3000/register', {
      email: email.value,
      password: password.value
    });
    registrationMessage.value = response.data.message || 'Registro exitoso.';
    registrationError.value = false;
    // Limpiar los campos después del registro exitoso
    email.value = '';
    password.value = '';
    // Opcional: Mostrar un mensaje por un tiempo y luego cambiar a la vista de login
    setTimeout(() => {
      showRegister.value = false;
      registrationMessage.value = '';
    }, 2000);
  } catch (error) {
    console.error('Error de registro:', error);
    registrationError.value = true;
    registrationMessage.value = error.response?.data?.message || 'Hubo un error al registrarse.';
  }
}
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
  background-color: var(--mainColor);
  padding: 2rem;
  margin-bottom: 1rem;
  width: 25rem;
  height: 17rem;
  border: none;
  color: var(--secondaryColor);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  transition: box-shadow 0.3s ease;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  border: 2px solid var(--secondaryColor);
}

.form-box h2 {
  /* Cambiado a Arial para consistencia */
  color: var(--secondaryColor);
  font-weight: bolder;
  /* Más fuerte */
  margin-bottom: 1rem;
  text-align: center;
  font-size: 1.5rem;
  /* Un poco más grande */
  /* Color del título principal */
}


.formInputs {
  width: 100%;
  margin-bottom: 0.5rem;
  border-radius: 10px;
  /* Añado esto */
}

.form-box-bg {
  border: 2px solid var(--secondaryColor);
  /* Borde con color secundario */
  background-color: var(--complementaryColor4);
  /* Mismo color que el fondo del modal principal */
  position: absolute;
  height: 100%;
  width: 100%;
  top: 15px;
  left: 15px;
  z-index: -1;
  transition: background-color 0.25s ease, top 0.25s ease, left 0.25s ease;
  border-radius: 12px;
  /* Mayor redondeado */
}

.form-box:hover .form-box-bg {

  /* Un gris más oscuro al pasar el ratón */
  top: 18px;
  left: 18px
}

input {
  display: block;
  width: 100%;
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  border: 1px solid var(--complementaryColor3);
  /* Borde sutil */
  font-size: 1rem;
  border-radius: 10px;

  /*añado estp */
}

.registerButton {
  padding: 0.5rem 0.9rem;
  border: none;
  background-color: var(--modalNuevo);
  color: var(--secondaryColor);
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  font-size: 0.90em;
  border-radius: 8px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  line-height: normal;
}

.registerButton:hover {
  background-color: var(--complementaryColor);
  color: var(--modalColor);
  transform: translateY(-2px);
}

.register-link,
.login-link {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.8rem;

}

.register-link a,
.login-link a {
  color: var(--secondaryColor);
  /* Color morado para el link */
  text-decoration: none;
  font-weight: bold;
  /* Para que el link destaque más */
  transition: color 0.3s ease;
  /* Transición para el color del texto */
}

.register-link a:hover,
.login-link a:hover {
  color: var(--complementaryColor2);
  text-decoration: underline;
  background-color: var(--secondaryColor);
  border-radius: 6px;
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

.inputStyle {
  background-color: var(--modalNuevo);
  border: 1px solid var(--secondaryColor);
  border-radius: 10px;
  font-size: 1rem;
  color: var(--secondaryColor);
}
</style>