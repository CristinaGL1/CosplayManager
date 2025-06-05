<template>

    <NavigationBar />
    <div class="cl">
        <lateralNav />
        <addTask />
        <section class="kanban">
            <div class="kabanBox">
                <div class="kanbanBox-titleBox">
                    <h3 class="kanbanBox-titleBox-title">SIN EMPEZAR</h3>
                    <button class="kanbanBox-titleBox-addButton" onclick="openAddTask()">+</button>
                </div>
                <div class="kanbanBox-taskBox" v-for="task in taskStartList" :key="task.id">
                    <div class="kanbanBox-card">
                        <span class="kanbanBox-card-title">{{ task.nombre }}</span>
                        <div class="kanbanBox-card-buttonBox">
                            <button class="kanbanBox-card-button">o</button>
                            <button class="kanbanBox-card-button">x</button>
                        </div>
                        <div class="kanbanBox-card-cardColor"></div>
                    </div>
                </div>
            </div>

            <div class="kabanBox">
                <div class="kanbanBox-titleBox">
                    <h3 class="kanbanBox-titleBox-title">EN PROCESO</h3>
                    <button class="kanbanBox-titleBox-addButton">+</button>
                </div>
                <div class="kanbanBox-taskBox" v-for="task in taskInProcessList" :key="task.id">
                    <div class="kanbanBox-card">
                        <span class="kanbanBox-card-title">{{ task.nombre }}</span>
                        <div class="kanbanBox-card-buttonBox">
                            <button class="kanbanBox-card-button">o</button>
                            <button class="kanbanBox-card-button">x</button>
                        </div>
                        <div class="kanbanBox-card-cardColor"></div>
                    </div>
                </div>
            </div>

            <div class="kabanBox">
                <div class="kanbanBox-titleBox">
                    <h3 class="kanbanBox-titleBox-title">FINALIZADO</h3>
                    <button class="kanbanBox-titleBox-addButton">+</button>
                </div>
                <div class="kanbanBox-taskBox" v-for="task in taskFinishList" :key="task.id">
                    <div class="kanbanBox-card">
                        <span class="kanbanBox-card-title">{{ task.nombre }}</span>
                        <div class="kanbanBox-card-buttonBox">
                            <button class="kanbanBox-card-button">o</button>
                            <button class="kanbanBox-card-button">x</button>
                        </div>
                        <div class="kanbanBox-card-cardColor"></div>
                    </div>
                </div>
            </div>
        </section>

    </div>

</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

import NavigationBar from '../components/NavigationBar.vue';
import lateralNav from '../components/lateralNav.vue';
import addTask from '../components/addTask.vue';


const taskStartList = ref([]);
const taskInProcessList = ref([]);
const taskFinishList = ref([]);

onMounted(async () => {

    recoverTasks();

});

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

async function openAddTask(){
    
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
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80vw;
    min-height: 53rem;
    height: 53rem;
    gap: 6rem;
    padding: 2rem;

}

.kabanBox {
    background-color: var(--secondaryColor);
    width: 20rem;
    height: 100%;

    border: 2px solid var(--mainColor);
    margin-top: 2rem;

    display: flex;
    flex-direction: column;

    border-radius: 10px;
}

.kanbanBox-titleBox {
    width: 100%;
    min-height: 3rem;
    max-height: 3rem;
    display: flex;

    border-bottom: 2px solid var(--mainColor);

    align-items: center;
    text-align: left;
    padding-left: 1rem;
}

.kanbanBox-titleBox-title {
    width: 85%;
    font-weight: 600;
}

.kanbanBox-titleBox-addButton {
    height: 100%;
    width: 3rem;

    background: none;
    border: none;

    background-color: var(--secondaryColor);
    border-left: 2px solid var(--mainColor);

    position: relative;

    border-radius: 0 10px 0 0;

    font-size: 1.5rem;
}

.kanbanBox-titleBox-addButton:hover {
    cursor: pointer;
    background-color: rgb(230, 230, 230);
}

.kanbanBox-taskBox {
    /* background-color: rgba(0, 255, 255, 0.342); */
    width: 100%;

    display: flex;

    margin: .25rem;

}

.kanbanBox-card {

    height: 8rem;
    width: 100%;

    margin: 1rem;

    border: 2px solid var(--mainColor);
    border-radius: 10px;

    display: flex;
    flex-direction: column;


}

.kanbanBox-card-title {
    height: 75%;
    width: 100%;
    display: flex;

    text-align: center;
    align-items: center;
    justify-content: center;

    font-size: 1.2rem;


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