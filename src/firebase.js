// src/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// ✅ Tu configuración personalizada de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAgWeqo978jXnjAhiVdl4jYD-lWpEvWbiA",
  authDomain: "cosplay-manager-123.firebaseapp.com",
  projectId: "cosplay-manager-123",
  storageBucket: "cosplay-manager-123.firebasestorage.app",
  messagingSenderId: "946046805561",
  appId: "1:946046805561:web:acb8e9069cf0f9ef380fe8",
  measurementId: "G-8L5KTW6Z76"
}

// Inicializa Firebase
const app = initializeApp(firebaseConfig)

// Exporta los servicios necesarios
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { auth, db, storage }
