import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import './firebase' // si ya tienes tu config Firebase

createApp(App).mount('#app')

// Inicializa Firebase
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Obtén una instancia de la autenticación
const auth = getAuth();

// Función para iniciar sesión
function login(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // El usuario ha iniciado sesión correctamente
            const user = userCredential.user;
            console.log("Usuario logueado:", user);
        })
        .catch((error) => {
            console.error("Error al iniciar sesión:", error.message);
        });
}
