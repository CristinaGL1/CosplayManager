// Importa la función addCosplay desde firestore.js
import { addCosplay } from './firestore';

// Datos de ejemplo para el cosplay
const cosplayData = {
    name: "Cosplay de Spiderman",
    status: "En proceso",
    cost: 150,
    imageURL: "https://link-a-la-imagen.jpg"
};

// Llamar a la función para agregar el cosplay
addCosplay(cosplayData);

// Ahora, manejamos el formulario para agregar cosplays de manera dinámica
const form = document.getElementById('cosplayForm');
const imageInput = document.getElementById('imageFile');

form.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita que la página se recargue al enviar el formulario

    // Captura los valores del formulario
    const cosplayData = {
        name: document.getElementById('name').value,
        status: document.getElementById('status').value,
        cost: parseInt(document.getElementById('cost').value, 10),
        imageURL: document.getElementById('image').value
    };

    // Llama a la función addCosplay para agregar los datos a Firestore
    addCosplay(cosplayData);

    // Limpiar el formulario después de agregar
    form.reset();
});