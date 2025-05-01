// src/firestore.js
import { collection, addDoc, getDocs } from 'firebase/firestore'
import { db } from './firebase' // Importa la instancia de Firestore desde firebase.js
import { getAuth } from 'firebase/auth' // Agregar esta línea


// Función para agregar un cosplay a la colección en Firestore
export async function addCosplay(cosplayData) {
    try {
        const docRef = await addDoc(collection(db, "cosplays"), cosplayData)
        console.log("Cosplay agregado con ID:", docRef.id)
    } catch (e) {
        console.error("Error al agregar cosplay:", e)
    }
}

//export { addCosplay }

// NUEVA FUNCIÓN para obtener cosplays
export async function getCosplays() {
    try {
        // Si no necesitas filtrar, solo obtén los documentos de la colección
        const querySnapshot = await getDocs(collection(db, "cosplays"));
        
        const cosplays = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        console.log("Datos de cosplays obtenidos:", cosplays);  // Verifica si los cosplays se obtienen correctamente
        return cosplays;
    } catch (e) {
        console.error("Error al obtener cosplays:", e);
        return [];
    }
}


 