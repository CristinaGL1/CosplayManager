<template>
    <section class="addTaskBox">

        <div>
            <form @submit.prevent="addTask">
                <label for="">Nombre</label>
                <input type="text" v-model="nombre" required>
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
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const nombre = ref('');
const estado = ref('');
const descripcion = ref('');

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

    display: flex;
    flex-direction: column;
    justify-content: center;

    width: 10rem;
    height: 50rem;
}

.addTaskBox div form {
    display: flex;
    flex-direction: column;
}
</style>