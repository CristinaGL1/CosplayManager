<template>

    <NavigationBar />
    <div class="cl">
        <lateralNav />
        <section class="kanban">
            <addTask v-if="showAddTaskModal" @close="toggleAddTaskModal"></addTask>
            <showOptions v-if="showTaskOptionsModal" @closeOptions="toggleTaskOptionsModal"></showOptions>
            <div class="kabanBox">
                <div class="kanbanBox-titleBox">
                    <h3 class="kanbanBox-titleBox-title">SIN EMPEZAR</h3>
                    <button class="kanbanBox-titleBox-addButton" @click="toggleAddTaskModal">+</button>
                </div>
                <div class="kanbanBox-taskBox" v-for="task in taskStartList" :key="task.id">
                    <div class="kanbanBox-card" @click="setTaskSelected(task.id); toggleTaskOptionsModal()">
                        <span class="kanbanBox-card-title">{{ task.nombre }}</span>
                        <!-- <div class="kanbanBox-card-buttonBox">
                            <button class="kanbanBox-card-button">o</button>
                            <button class="kanbanBox-card-button">x</button>
                        </div> -->
                        <!-- <div class="kanbanBox-card-cardColor"></div> -->
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
                        <!-- <div class="kanbanBox-card-buttonBox">
                            <button class="kanbanBox-card-button">o</button>
                            <button class="kanbanBox-card-button">x</button>
                        </div>
                        <div class="kanbanBox-card-cardColor"></div> -->
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
                        <!-- <div class="kanbanBox-card-buttonBox">
                            <button class="kanbanBox-card-button">o</button>
                            <button class="kanbanBox-card-button">x</button>
                        </div>
                        <div class="kanbanBox-card-cardColor"></div> -->
                    </div>
                </div>
            </div>
        </section>

    </div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

import NavigationBar from '../components/NavigationBar.vue';
import lateralNav from '../components/lateralNav.vue';
import addTask from '../components/addTask.vue';
import showOptions from '../components/taskDetails.vue';


const taskStartList = ref([]);
const taskInProcessList = ref([]);
const taskFinishList = ref([]);

const showAddTaskModal = ref(false)
const showTaskOptionsModal = ref(false)

onMounted(async () => {

    recoverTasks();

});

const toggleAddTaskModal = () => {
    showAddTaskModal.value = !showAddTaskModal.value;
    console.log('Estado del modal (showAddTaskModal.value):', showAddTaskModal.value);
};

const toggleTaskOptionsModal = () => {
    showTaskOptionsModal.value = !showTaskOptionsModal.value;
    console.log('Estado del modal (showTaskOptionsModal.value):', showTaskOptionsModal.value);
};

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
    justify-content: center;
    align-items: flex-start;
    width: 80vw;
    min-height: 53rem;
    height: auto;
    gap: 6rem;


}

.kabanBox {
    background-color: var(--mainColor);
    width: 20rem;
    min-height: 50rem;
    height: auto;

    border: 2px solid var(--secondaryColor);
    margin-top: 2rem;
    margin-bottom: 2rem;

    display: flex;
    flex-direction: column;

    border-radius: 10px;
}

.kanbanBox-titleBox {
    width: 100%;
    height: 3rem;

    display: flex;

    border-bottom: 2px solid var(--secondaryColor);

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
    color: var(--secondaryColor);
}

.kanbanBox-titleBox-addButton {
    height: 100%;
    width: 3rem;

    background: none;
    border: none;

    background-color: var(--mainColor);
    border-left: 2px solid var(--secondaryColor);
    color: var(--secondaryColor);

    position: relative;

    border-radius: 0 6px 0 0;

    font-size: 1.5rem;
    transition: background-color 0.25s, font-size 0.15s;
}

.kanbanBox-titleBox-addButton:hover {
    cursor: pointer;
    background-color: var(--secondaryColor);
    color: var(--mainColor);
    font-size: 2rem;
}

.kanbanBox-taskBox {
    width: 100%;
    display: flex;
}

.kanbanBox-card {
    height: 8rem;
    width: 100%;

    margin: 1rem;

    background-color: var(--secondaryColor);
    border-radius: 10px;

    display: flex;
    flex-direction: column;

    box-shadow: 0 0 0px 0px var(--secondaryColor);

    font-size: 1.25rem;
    transition: font-size 0.15s, box-shadow 0.25s;
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