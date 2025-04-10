// src/firestore.js
import { collection, addDoc } from 'firebase/firestore'
import { db } from './firebase' // Importa la instancia de Firestore desde firebase.js

// Función para agregar un cosplay a la colección en Firestore
export async function addCosplay(cosplayData) {
    try {
        const docRef = await addDoc(collection(db, "cosplays"), cosplayData)
        console.log("Cosplay agregado con ID:", docRef.id)
    } catch (e) {
        console.error("Error al agregar cosplay:", e)
    }
}

export { addCosplay }
