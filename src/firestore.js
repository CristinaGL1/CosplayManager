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
    const response = await axios.post('http://localhost:3000/api/cosplays', cosplayData);
    console.log("Cosplay agregado en el backend con ID:", response.data.id); // Asumiendo que tu backend devuelve el ID
    return response.data; // Podrías querer retornar la respuesta completa o solo el ID
  } catch (error) {
    console.error("Error al agregar cosplay al backend:", error);
    throw error; // Re-lanzamos el error para que el componente AddCosplay pueda manejarlo si es necesario
  }
}