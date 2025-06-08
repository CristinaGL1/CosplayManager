<template>
    <section class="addTaskBox">
        <div class="modalBox">
            <form @submit.prevent="addTask">
                <label for="">Nombre</label>
                <input type="text" v-model="nombre" required maxlength="50">
                <label for="">Estado</label>
                <select v-model="estado" required>
                    <option value="0">Sin empezar</option>
                    <option value="1">En proceso</option>
                    <option value="2">Finalizado</option>
                </select>
                <input type="submit" value="Enviar" class="sendButton">
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
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1010;
    padding-left: 18vw;
    padding-right: 1vw;
    padding-top: 10vh;
    padding-bottom: 3vh;
    box-sizing: border-box;
}


.modalBox {
    background-color: var(--mainColor);
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    text-align: center;
    width: 100%;
    max-width: 400px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    position: relative;
    color: var(--secondaryColor);
    border: 2px solid var(--secondaryColor);

}

/* Estilos para el formulario interno */
.addTaskBox div form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    /* Espacio entre los elementos del formulario (label-input/select) */
    align-items: stretch;
    /* Asegura que los elementos se estiren */
    margin-top: 15px;
    /* Espacio superior para el formulario */
    margin-bottom: 5px;
    /* Espacio inferior antes del botón de cerrar */
}

/* Estilos para las etiquetas */
.addTaskBox div form label {
    color: var(--secondaryColor);
    /* Color del texto de las etiquetas */
    text-align: left;
    /* Alinea el texto de la etiqueta a la izquierda */
    margin-bottom: -10px;
    /* Ajuste para acercar label al input */
    font-weight: 500;
}

/* Estilos para inputs de texto y select */
.addTaskBox div form input[type="text"],
.addTaskBox div form select {
    width: 100%;
    padding: 12px;
    /* Padding para hacer los inputs más grandes */
    border: 2px solid var(--secondaryColor);
    /* Un borde sutil, con fallback */
    border-radius: 8px;
    /* Bordes redondeados */
    box-sizing: border-box;
    font-size: 1em;
    background-color: var(--modalNuevo);
    color: var(--secondaryColor);
    /* Color del texto dentro del input */
    outline: none;
    /* Quita el contorno al hacer focus */
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    margin-top: 5px;
    /* Ajuste para separar del label */
}

.addTaskBox div form input[type="text"]:focus,
.addTaskBox div form select:focus {
    border-color: var(--complementaryColor);
    /* Cambia el borde al enfocar */
    box-shadow: 0 0 0 3px rgba(106, 13, 173, 0.2);
    /* Un suave brillo al enfocar */
}


.addTaskBox div form input[type="submit"]:hover {
    background-color: var(--complementaryColor);
    /* Tono más oscuro al pasar el ratón */
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(106, 13, 173, 0.2);
}

/* Estilo para el botón "Cerrar" */
.addTaskBox div>button {

    background-color: var(--secondaryColor);
    color: var(--mainColor);
    border: 1px solid var(--complementaryColor3);
    padding: 12px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1em;
    font-weight: 600;
    transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
    width: 100%;
    margin-top: 15px;

}

.addTaskBox div>button:hover {
    background-color: var(--secondaryColor);
    transform: translateY(-1px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.sendButton {
    background-color: var(--complementaryColor);
    color: var(--secondaryColor);
    padding: 12px 20px;
    border: 2px solid var(--secondaryColor);
    border-radius: 8px;
    cursor: pointer;
    font-size: 1em;
    font-weight: 600;
    transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
    width: 100%;
    margin-top: 10px;
}
</style>