import axios from 'axios';

export const getCosplays = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/cosplays?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error al cargar cosplays desde el backend:', error);
    return [];
  }
};
export const getCosplay = async (userId, cosplayId) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/cosplays/${cosplayId}?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al cargar los detalles del cosplay con ID ${cosplayId} desde el backend:`, error);
    return null;
  }
};
// Puedes mantener tu función addCosplay si sigues usándola para guardar en Firestore
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase'; // Importa la instancia de Firestore desde firebase.js

export async function addCosplay(cosplayData) {
  try {
    const docRef = await addDoc(collection(db, "cosplays"), cosplayData);
    console.log("Cosplay agregado con ID:", docRef.id);
  } catch (e) {
    console.error("Error al agregar cosplay:", e);
  }
}