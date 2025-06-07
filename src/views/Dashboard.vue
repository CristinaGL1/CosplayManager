<template>

    <NavigationBar />
    <div class="cl">

        <lateralNav @openCosplayModal="openModal"></lateralNav>
        <CosplayOptionsModal v-if="showOptionsModal" :cosplayId="selectedCosplayIdForModal"
            @close="showOptionsModal = false" @view-dashboard="goToDashboard" @view-details="goToDetails" />
        <div v-if="showDetailsModal" class="details-modal-overlay">
            <CosplayDetails :id="selectedCosplayIdForDetails" @close="showDetailsModal = false" />
        </div>


        <section class="kanban">
            <addTask v-if="showAddTaskModal" @close="toggleAddTaskModal"></addTask>
            <showOptions v-if="showTaskOptionsModal" @closeOptions="toggleTaskOptionsModal"></showOptions>
            <div class="cosplaytitle">{{ selectedCosplay.nombre }}</div>
            <div class="kanbanDisplay">
                <div class="kabanBox">
                    <div class="kanbanBox-titleBox">
                        <h3 class="kanbanBox-titleBox-title">SIN EMPEZAR</h3>
                        <button class="kanbanBox-titleBox-addButton" @click="toggleAddTaskModal">+</button>
                    </div>
                    <div class="kanbanBox-taskBox" v-for="task in taskStartList" :key="task.id">
                        <div class="kanbanBox-card" @click="setTaskSelected(task.id); toggleTaskOptionsModal()">
                            <span class="kanbanBox-card-title">{{ task.nombre }}</span>
                        </div>
                    </div>
                </div>

                <div class="kabanBox">
                    <div class="kanbanBox-titleBox">
                        <h3 class="kanbanBox-titleBox-title">EN PROCESO</h3>
                        <button class="kanbanBox-titleBox-addButton" @click="toggleAddTaskModal">+</button>
                    </div>
                    <div class="kanbanBox-taskBox" v-for="task in taskInProcessList" :key="task.id">
                        <div class="kanbanBox-card">
                            <span class="kanbanBox-card-title">{{ task.nombre }}</span>
                        </div>
                    </div>
                </div>

                <div class="kabanBox">
                    <div class="kanbanBox-titleBox">
                        <h3 class="kanbanBox-titleBox-title">FINALIZADO</h3>
                        <button class="kanbanBox-titleBox-addButton" @click="toggleAddTaskModal">+</button>
                    </div>
                    <div class="kanbanBox-taskBox" v-for="task in taskFinishList" :key="task.id">
                        <div class="kanbanBox-card">
                            <span class="kanbanBox-card-title">{{ task.nombre }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    </div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';


import NavigationBar from '../components/NavigationBar.vue';
import lateralNav from '../components/lateralNav.vue';
import addTask from '../components/addTask.vue';
import showOptions from '../components/taskDetails.vue';

import CosplayOptionsModal from '../components/CosplayOptionsModal.vue';
import CosplayDetails from '../views/CosplayDetails.vue';

const selectedCosplay = ref([]);

const taskStartList = ref([]);
const taskInProcessList = ref([]);
const taskFinishList = ref([]);

const showOptionsModal = ref(false);
const showDetailsModal = ref(false);

const showAddTaskModal = ref(false)
const showTaskOptionsModal = ref(false)
const selectedCosplayIdForModal = ref(null);
const selectedCosplayIdForDetails = ref(null);

const router = useRouter();


onMounted(async () => {

    recoverTasks();
    recoverCosplay();
});

const toggleAddTaskModal = () => {
    showAddTaskModal.value = !showAddTaskModal.value;
    console.log('Estado del modal (showAddTaskModal.value):', showAddTaskModal.value);
};

const toggleTaskOptionsModal = () => {
    showTaskOptionsModal.value = !showTaskOptionsModal.value;
    console.log('Estado del modal (showTaskOptionsModal.value):', showTaskOptionsModal.value);
};

async function recoverCosplay() {

    try {
        const response = await axios.get(`http://localhost:3000/api/cosplays/${localStorage.selectedCosplay}`);
        selectedCosplay.value = response.data[0];
    } catch (error) {
        console.error('Error al cargar el cosplay del usuario:', error);
        // Manejar el error
    }
}

async function recoverTasks() {
    //Recuperar las tareas sin empezar
    try {
        const response = await axios.get(`http://localhost:3000/api/getTask0/${localStorage.selectedCosplay}`);
        taskStartList.value = response.data;
    } catch (error) {
        console.error('Error al cargar las tareas del usuario:', error);
        // Manejar el error
    }

    //Recuperar las tareas en proceso
    try {
        const response = await axios.get(`http://localhost:3000/api/getTask1/${localStorage.selectedCosplay}`);
        taskInProcessList.value = response.data;
    } catch (error) {
        console.error('Error al cargar las tareas del usuario:', error);
        // Manejar el error
    }
    //Recuperar las tareas finalizadas
    try {
        const response = await axios.get(`http://localhost:3000/api/getTask2/${localStorage.selectedCosplay}`);
        taskFinishList.value = response.data;
    } catch (error) {
        console.error('Error al cargar las tareas del usuario:', error);
        // Manejar el error
    }
}

function setTaskSelected(id) {
    localStorage.setItem('selectedTask', id);
}

const openModal = () => {
    showOptionsModal.value = true;
};

const goToDashboard = () => {
    showOptionsModal.value = false;
    router.push(`/dashboard`);
    window.location.reload();
};

const goToDetails = (id) => {
    showOptionsModal.value = false;
    selectedCosplayIdForDetails.value = id;
    showDetailsModal.value = true;
};

</script>

<style scoped>
#app {
    height: 100%;
    width: 100%;


}

.cl {
    height: 100%;
    width: 100%;
    display: flex;
    padding-top: 60px;
    box-sizing: border-box;
}

.kanban {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100vw;
    min-height: 43rem;
    height: auto;
    margin-top: 2rem;
    margin-left: 5rem;
    margin-right: 5rem;

}

.cosplayTitle {
    font-size: 2rem;
    background-color: var(--mainColor);
    border-radius: 10px;
    width: 80%;
    min-width: 20rem;
    text-align: center;
    color: var(--secondaryColor);
    border: 2px solid var(--secondaryColor);
    margin-top: 5rem;
}

.kanbanDisplay {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 80%;
    min-height: 100%;
    height: auto;
    gap: 6rem;
}

.kabanBox {
    background-color: var(--mainColor);
    width: 20rem;
    height: 43rem;

    border: 2px solid var(--secondaryColor);
    margin-top: 2rem;
    margin-bottom: 2rem;

    display: flex;
    flex-direction: column;

    border-radius: 10px;
    overflow: auto;
}

/* Estilo del scroll */
.kabanBox::-webkit-scrollbar {
    width: 10px;
    /* ancho vertical */
}

/* Fondo del scroll */
.kabanBox::-webkit-scrollbar-track {
    background: none;
}

/* Parte móvil del scroll */
.kabanBox::-webkit-scrollbar-thumb {
    background-color: var(--secondaryColor);
    border-radius: 0 6px 6px 0;
    border: 2px solid var(--mainColor);
}

/* Cuando pasas el mouse encima */
.kabanBox::-webkit-scrollbar-thumb:hover {
    background-color: var(--mainColor);
    border: 2px solid var(--secondaryColor);
}

.kanbanBox-titleBox {
    width: 100%;
    min-height: 3rem;
    height: 3rem;

    display: flex;

    border-bottom: 2px solid var(--secondaryColor);
    border-radius: 7px 7px 0 0;
    background-color: var(--secondaryColor);

    text-align: center;
}

.kanbanBox-titleBox-title {
    width: 85%;
    display: flex;
    justify-content: left;
    padding-left: 20px;
    align-items: center;
    font-weight: 600;
    font-size: 1.2rem;
    color: var(--mainColor);
}

.kanbanBox-titleBox-addButton {
    height: 100%;
    width: 3rem;

    background: none;
    border: none;

    background-color: var(--secondaryColor);
    border-left: 2px solid var(--secondaryColor);
    color: var(--mainColor);

    position: relative;

    border-radius: 0 6px 0 0;

    font-size: 1.5rem;
    font-weight: 400;
    transition: font-size 0.15s, font-weight 0.15s;
}

.kanbanBox-titleBox-addButton:hover {
    cursor: pointer;
    color: var(--mainColor);
    font-size: 2rem;
    font-weight: 600;
}

.kanbanBox-taskBox {
    width: 100%;
    display: flex;
    object-fit: cover;
}

.kanbanBox-card {
    height: 8rem;
    width: 100%;

    margin: 1rem;

    background-color: var(--modalNuevo);
    border-radius: 10px;
    border: 2px solid var(--secondaryColor);

    color: var(--secondaryColor);
    display: flex;
    flex-direction: column;

    box-shadow: 0 0 0px 0px var(--secondaryColor);

    font-size: 1.25rem;
    transition: font-size 0.15s, box-shadow 0.25s;
    object-fit: cover;
}

.kanbanBox-card:hover {
    cursor: pointer;
    font-size: 1.5rem;

    box-shadow: 0 0 5px 0px var(--secondaryColor);
}

.kanbanBox-card-title {
    height: 100%;
    width: 100%;
    display: flex;

    text-align: center;
    align-items: center;
    justify-content: center;

    border-radius: 20px;

}

.kanbanBox-card-buttonBox {
    height: 20%;
    width: 100%;
    display: flex;
    gap: 0.5rem;
    justify-content: right;
    padding-right: 0.5rem;
}

.kanbanBox-card-button {
    height: 100%;
    width: 1.75rem;
}

.kanbanBox-card-cardColor {
    height: 5%;
    width: 100%;

    border-radius: 0 0 10px 10px;

    background-color: rgb(253, 0, 0);

    border-left: 1px solid var(--mainColor);
    border-right: 1px solid var(--mainColor);
}
</style>