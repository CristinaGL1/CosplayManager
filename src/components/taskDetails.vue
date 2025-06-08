<template>
    <section class="modalBox" v-if="!editando">
        <div class="modalBox-title">
            <h4>{{ selectedTask.nombre }}</h4>
        </div>
        <div class="modalBox-content">
            <div class="modalBox-content-box">
                <div class="modalBox-content-progress mainLetterColor">
                    <!-- <span>{{ `Coste: ${selectedTask.coste}€` }}</span> -->
                     <span style="font-weight: 600;">{{ `Coste: ` }}</span>
                     <span>{{ `${selectedTask.coste}` }}</span>
                     <span>{{ ` €` }}</span>
                </div>
                <div class="modalBox-content-cost mainLetterColor">
                    <span style="font-weight: 600;">{{ `Progreso: ` }}</span>
                    <span>{{ `${selectedTask.progreso}` }}</span>
                    <span>{{ ` %` }}</span>
                </div>
                <div class="modalBox-content-estatus mainLetterColor">
                    <span style="font-weight: 600;">{{ `Estado: ` }}</span>
                    <span>{{ `${selectedTask.nombreEstado}` }}</span>
                </div>
            </div>
            <div class="modalBox-content-DescriptionBox">
                <h4>DESCRIPCION DE LA TAREA</h4>
                <p class="mainLetterColor modalBox-content-DescriptionBox-description">{{ selectedTask.descripcion }}</p>
            </div>
            <div class="modalBox-content-buttonBox">
                <button class="modalButton mainLetterColor" @click="toggleEdit">Editar</button>
                <button class="modalButton mainLetterColor" @click="emit('closeOptions')">Volver</button>
            </div>
        </div>
    </section>

    <form class="modalBox" @submit.prevent="guardarEdicion" v-else>
        <div class="modalBox-title">
            <input type="text" v-model="formNombre" class="inputStyle inputName">
        </div>
        <div class="modalBox-content">
            <div class="modalBox-content-box">
                <div class="modalBox-content-detail mainLetterColor">
                    <label>Coste: </label>
                    <input type="number" class="inputStyle inputCost" v-model="formCoste"></input>
                </div>
                <div class="modalBox-content-detail mainLetterColor">
                    <label>Progreso: </label>
                    <input type="range" min="0" max="100" step="1" :style="estiloSlider"
                        class="inputStyle inputProgress" v-model="formProgreso">
                </div>
                <div class="modalBox-content-detail mainLetterColor">
                    <label>Estado: </label>
                    <select required class="inputStyle inputEstatus" v-model="formEstado">
                        <option value="0">Sin empezar</option>
                        <option value="1">En progreso</option>
                        <option value="2">Finalizado</option>
                    </select>
                </div>

            </div>
            <div class="modalBox-content-DescriptionBox">
                <h4>DESCRIPCION DE LA TAREA</h4>
                <textarea class="inputStyle inputDescription" v-model="formDescripcion"></textarea>
            </div>
            <div class="modalBox-content-buttonBox">
                <input type="submit" class="modalButton mainLetterColor" value="Guardar"></input>
                <button class="modalButton mainLetterColor" @click="toggleEdit()">Volver</button>
            </div>
        </div>
    </form>
</template>

<script setup>

import { reactive, onMounted, ref, computed } from 'vue';
import axios from 'axios';

const taskSelected = ref([]);
const selectedTask = reactive({
    nombre: "",
    descripcion: "",
    estado: "",
    coste: "",
    nombreEstado: "",
});

//#region Varibles de formulario
const formNombre = ref('');
const formEstado = ref('');
const formDescripcion = ref('');
const formCoste = ref(0);
const formProgreso = ref(0);
//#endregion

const editando = ref(false);

const estiloSlider = computed(() => ({
    background: `linear-gradient(to right, var(--modalNuevo) ${formProgreso.value}%, var(--mainColor) ${formProgreso.value}%, var(--mainColor) 100%)`

}))

const emit = defineEmits(['closeOptions'])

onMounted(() => {
    recoverTask();
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
        selectedTask.progreso = taskSelected.value[0].progreso;

        console.log("SelectedTask");
        console.log(selectedTask);

        formNombre.value = selectedTask.nombre;
        formEstado.value = selectedTask.estado;
        formDescripcion.value = selectedTask.descripcion;
        formCoste.value = selectedTask.coste;
        formProgreso.value = selectedTask.progreso;


    } catch (error) {
        console.error('Error al cargar las tareas del usuario:', error);
        // Manejar el error
    }

    if (selectedTask.estado == 0) {
        selectedTask.nombreEstado = "Sin empezar"
    } else if (selectedTask.estado == 1) {
        selectedTask.nombreEstado = "En progreso"
    } else {
        selectedTask.nombreEstado = "Finalizado"
    }
}

async function guardarEdicion() {
    try {
        const response = await axios.put(`http://localhost:3000/saveTaskEdit/${localStorage.selectedTask}`, {
            nombre: formNombre.value,
            estado: formEstado.value,
            descripcion: formDescripcion.value,
            coste: formCoste.value,
            progreso: formProgreso.value
        });

        window.location.reload();

    } catch (error) {
        console.error('Error al actualizar el cosplay en el backend:', error);
        alert('Error al guardar cambios');
    }
}

async function toggleEdit() {
    console.log("-----");
    console.log(formProgreso.value);
    if (editando.value == true) {
        editando.value = false
    } else {
        editando.value = true
    }
}

</script>

<style scoped>
.modalBox {
    position: absolute;
    top: 48%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 85%;
    height: 96%;
    margin-bottom: 2rem;

    display: flex;
    flex-direction: column;

    border-radius: 20px;
    box-shadow: 0 0 10px 500rem rgba(0, 0, 0, 0.25);
    z-index: 1;

    background-color: var(--mainColor);
    border: 2px solid var(--secondaryColor);

}

.modalBox-title {
    border-bottom: 2px solid var(--secondaryColor);
    width: 100%;
    min-height: 5rem;
    height: 5rem;

    display: flex;
    justify-content: center;
    align-items: center;

    font-family: Arial, Helvetica, sans-serif;
    font-weight: bolder;
    font-size: 2.25rem;

    color: var(--secondaryColor);

}

.modalBox-title h4{
    font-weight: 600;
}

.mainLetterColor {
    color: var(--secondaryColor);
}

.modalBox-content {

    padding: 1rem;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.modalBox-content-box {
    display: flex;
    gap: 2rem;
    justify-content: space-around;
    margin: 1rem 0;
    font-size: 1.4rem;
}

.modalBox-content-DescriptionBox {
    border-top: 1px solid var(--secondaryColor);
    margin-top: 1rem;
    padding-top: 1rem;
    height: 90%;
}

.modalBox-content-DescriptionBox h4 {
    color: var(--secondaryColor);
    font-weight: 600;
    font-size: 1.5rem;
}

.modalBox-content-buttonBox {
    display: flex;
    gap: 15px;
    justify-content: flex-end;
}

.modalButton {
    padding: 0.5rem 0.9rem;
    border: none;
    background-color: var(--modalNuevo);
    color: var(--secondaryColor);
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    font-size: 0.90em;
    border-radius: 8px;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    line-height: normal;
}

.modalButton:hover {
    background-color: var(--complementaryColor);
    color: var(--modalColor);
    transform: translateY(-2px);
}

.modalBox-content-DescriptionBox-description{
    border-radius: 10px;
    height: 85%;
    border: 1px solid var(--secondaryColor);
    font-size: 1.5rem;
    padding: 1rem;
}

.inputStyle {
    background-color: var(--modalNuevo);
    border: 1px solid var(--secondaryColor);
    border-radius: 10px;
    font-size: 1rem;
    color: var(--secondaryColor);
}

.inputName {
    height: 60%;
    width: 60%;
    padding-left: 0.5rem;
}

.inputCost {
    width: 60%;
    border-radius: 5px;
}

.inputProgress {
    -webkit-appearance: none;
    /* Elimina el estilo por defecto */
    background-color: var(--modalNuevo);
    /* gris claro */
    border-radius: 5px;
    cursor: pointer;
    outline: none;
}

.inputProgress::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 100%;
    background-color: var(--secondaryColor);
    /* verde esmeralda */
    border-radius: 20%;
    border: 1px solid var(--mainColor);
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.4);
    cursor: grab;
}

.inputEstatus {
    border-radius: 5px;
}

.inputDescription {
    width: 100%;
    height: 85%;
    padding: 1rem;
    resize: none;
}

.modalBox-content-detail {
    display: flex;
    justify-items: center;
    gap: 0.5rem;
}


</style>