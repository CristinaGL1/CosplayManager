// src/firestore.js
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase'; // Importa la instancia de Firestore desde firebase.js
import { getAuth } from 'firebase/auth'; // Agregar esta línea

// Función para agregar un cosplay a la colección en Firestore
export async function addCosplay(cosplayData) {
  try {
    const docRef = await addDoc(collection(db, "cosplays"), cosplayData);
    console.log("Cosplay agregado con ID:", docRef.id);
  } catch (e) {
    console.error("Error al agregar cosplay:", e);
  }
}

// NUEVA FUNCIÓN para obtener cosplays filtrados por userId
export async function getCosplays() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    console.log('No hay usuario autenticado, devolviendo lista de cosplays vacía.');
    return [];
  }

  try {
    const cosplaysCollection = collection(db, 'cosplays');
    const q = query(cosplaysCollection, where('userId', '==', user.uid));

    const querySnapshot = await getDocs(q);
    const cosplays = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log("Datos de cosplays obtenidos para el usuario:", user.uid, cosplays);
    return cosplays;
  } catch (e) {
    console.error("Error al obtener cosplays:", e);
    return [];
  }
}