<template>
    <section class="modalBox">
        <div class="modalBox-title">
            <h4>{{ selectedTask.nombre }}</h4>
        </div>
        <div class="modalBox-content">
            <div class="modalBox-content-progress">
                <span>{{ `Coste ${selectedTask.coste}€` }}</span>
            </div>
            <div class="modalBox-content-cost">
                <span>{{ `Progreso ${selectedTask.coste}%` }}</span>
            </div>
            <div class="modalBox-content-notesBox"></div>
            <div class="modalBox-content-buttonBox">
                <button class="modalButton">Editar</button>
                <button class="modalButton" @click="emit('closeOptions')">Volver</button>
            </div>
        </div>
    </section>
</template>

<script setup>

import { reactive, onMounted, ref } from 'vue';
import axios from 'axios';

const taskSelected = ref([]);
const selectedTask = reactive({
    nombre: "",
    descripcion: "",
    estado: "",
    coste: "",
});

async function recoverTask() {
    try {
        console.log(localStorage.selectedTask)
        const response = await axios.get(`http://localhost:3000/api/getTask/${localStorage.selectedTask}`);
        // const response = await axios.get(`http://localhost:3000/api/getTask/1`);
        taskSelected.value = response.data;
        selectedTask.nombre = taskSelected.value[0].nombre;
        selectedTask.descripcion = taskSelected.value[0].descripcion;
        selectedTask.estado = taskSelected.value[0].estado;
        selectedTask.coste = taskSelected.value[0].coste;
        console.log(selectedTask)

    } catch (error) {
        console.error('Error al cargar las tareas del usuario:', error);
        // Manejar el error
    }
}

const emit = defineEmits(['closeOptions'])

onMounted(() => {
    recoverTask();
});


</script>

<style scoped>
.modalBox {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 55rem;
    height: 35rem;

    display: flex;
    flex-direction: column;

    border-radius: 20px;
    box-shadow: 0 0 10px 500rem rgba(0, 0, 0, 0.603);
    z-index: 1;

    background-color: var(--complementaryColor4);

}

.modalBox-title {
    border-bottom: 2px solid var(--secondaryColor);
    width: 100%;
    height: 2rem;

    display: flex;
    justify-content: center;
    align-items: center;

    font-weight: 600;
    font-size: 1.5rem;



}
</style>