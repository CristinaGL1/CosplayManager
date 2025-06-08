<template>
    <section class="addTaskBox">
        <div>
            <form @submit.prevent="addTask">
                <label for="">Nombre</label>
                <input type="text" v-model="nombre" required maxlength="50">
                <label for="">Estado</label>
                <select v-model="estado" required>
                    <option value="0">Sin empezar</option>
                    <option value="1">En proceso</option>
                    <option value="2">Finalizado</option>
                </select>
                <input type="submit" value="enviar">
            </form>
            <button @click="emit('close')">Cerrar</button>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const nombre = ref('');
const estado = ref('');

const emit = defineEmits(['close'])

async function addTask() {

    try {

        console.log(localStorage.selectedCosplay)
        const response = await axios.post('http://localhost:3000/api/addTask', {
            nombre: nombre.value,
            estado: parseInt(estado.value),
            cosplayID: localStorage.selectedCosplay
        });

        console.log('Respuesta del servidor:', response.data);
        window.location.reload();

    } catch (error) {
        console.error('Error de registro:', error.response?.data?.message || error.message);
        // Aquí puedes mostrar un mensaje de error al usuario
    }
}

</script>

<style scoped>
.addTaskBox {
    position: fixed; /* Cambiado a fixed para cubrir toda la ventana */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Fondo oscuro semitransparente */
    display: flex; /* Para centrar el div interno */
    justify-content: center;
    align-items: center;
    z-index: 1000; /* Asegura que esté por encima de otros elementos */
}

/* Este es el 'div' interno del addTaskBox */
.addTaskBox > div {
    background-color: var(--modalColor); /* Color de fondo sólido para la caja del modal */
    padding: 30px; /* Un poco más de padding */
    border-radius: 12px; /* Bordes más redondeados */
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2); /* Sombra más pronunciada y suave */
    text-align: center; /* Centra el contenido dentro del modal */
    width: 100%;
    max-width: 400px; /* Ancho máximo para el modal (ajustable) */
    box-sizing: border-box; /* Incluye padding en el ancho */
    display: flex; /* Para organizar elementos internos */
    flex-direction: column;
    position: relative; /* Para el posicionamiento interno si fuera necesario */
}

/* Estilos para el formulario interno */
.addTaskBox div form {
    display: flex;
    flex-direction: column;
    gap: 15px; /* Espacio entre los elementos del formulario (label-input/select) */
    align-items: stretch; /* Asegura que los elementos se estiren */
    margin-top: 15px; /* Espacio superior para el formulario */
    margin-bottom: 5px; /* Espacio inferior antes del botón de cerrar */
}

/* Estilos para las etiquetas */
.addTaskBox div form label {
    color: var(--mainColor); /* Color del texto de las etiquetas */
    text-align: left; /* Alinea el texto de la etiqueta a la izquierda */
    margin-bottom: -10px; /* Ajuste para acercar label al input */
    font-weight: 500;
}

/* Estilos para inputs de texto y select */
.addTaskBox div form input[type="text"],
.addTaskBox div form select {
    width: 100%;
    padding: 12px; /* Padding para hacer los inputs más grandes */
    border: 2px solid var(--secondaryColor); /* Un borde sutil, con fallback */
    border-radius: 8px; /* Bordes redondeados */
    box-sizing: border-box;
    font-size: 1em;
    background-color: var(--modalColor);    
    color: var(--mainColor); /* Color del texto dentro del input */
    outline: none; /* Quita el contorno al hacer focus */
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    margin-top: 5px; /* Ajuste para separar del label */
}

.addTaskBox div form input[type="text"]:focus,
.addTaskBox div form select:focus {
    border-color: var(--complementaryColor); /* Cambia el borde al enfocar */
    box-shadow: 0 0 0 3px rgba(106, 13, 173, 0.2); /* Un suave brillo al enfocar */
}


/* Estilo para el botón de "Enviar" (input type="submit") */
.addTaskBox div form input[type="submit"] {
    background-color: var(--complementaryColor); /* Color de tus botones principales */
    color: var(--secondaryColor); /* Color de texto claro */
    padding: 12px 20px; /* Padding para hacer los botones más grandes */
    border: none;
    border-radius: 8px; /* Bordes redondeados */
    cursor: pointer;
    font-size: 1em;
    font-weight: 600;
    transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
    width: 100%; /* Ocupa todo el ancho */
    margin-top: 10px; /* Espacio superior para separar del último input/select */
}

.addTaskBox div form input[type="submit"]:hover {
    background-color: var(--complementaryColor); /* Tono más oscuro al pasar el ratón */
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(106, 13, 173, 0.2);
}

/* Estilo para el botón "Cerrar" */
.addTaskBox div > button { /* Apuntamos al botón directamente dentro del div */
    background-color: var(--secondaryColor); /* Fondo más claro */
    color: var(--complementaryColor3); /* Color de texto oscuro */
    border: 1px solid var(--complementaryColor3);
    padding: 12px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1em;
    font-weight: 600;
    transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
    width: 100%;
    margin-top: 15px; /* Un poco más de espacio arriba */
}

.addTaskBox div > button:hover {
    background-color: var(--secondaryColor);
    transform: translateY(-1px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}


</style>