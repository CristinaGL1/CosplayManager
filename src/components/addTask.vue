<template>
    <section class="addTaskBox">
        <div>
            <form @submit.prevent="addTask">
                <label for="">Nombre</label>
                <input type="text" v-model="nombre" required maxlength="50">
                <label for="">Descripcion</label>
                <input type="text" v-model="descripcion">
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
const descripcion = ref('');

const emit = defineEmits(['close'])

async function addTask() {

    try {

        console.log(localStorage.selectedCosplay)
        const response = await axios.post('http://localhost:3000/api/addTask', {
            nombre: nombre.value,
            estado: parseInt(estado.value),
            descripcion: descripcion.value,
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
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);


    display: flex;
    flex-direction: column;
    justify-content: center;

    width: 25rem;
    height: 15rem;

    background-color: var(--complementaryColor4);

    padding: 1rem;
}

.addTaskBox div form {
    display: flex;
    flex-direction: column;
}

input[type="text"] {
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    border-radius: 6px;
    box-sizing: border-box;
    font-size: 1em;
    background-color: var(--complementaryColor4);
    /* Fondo para inputs */
    color: var(--mainColor);
}
</style>