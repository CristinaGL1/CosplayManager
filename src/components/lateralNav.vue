<template>
    <section class="lateralNav">
        <h1>Lista de Cosplays</h1>
        <div v-for="cosplay in cosplays" :key="cosplay.id" class="lateralCosplayBox" >
            <div class="lateralCosplayButton" @click="setSelectedCosplay(cosplay.id); emit('openCosplayModal')">
                <h4>{{ cosplay.nombre }}</h4>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { defineProps, defineEmits } from 'vue';

import axios from 'axios';
import Cookies from 'js-cookie'

const cosplays = ref([]);
const loggedInUserId = Cookies.get('userID');

const emit = defineEmits(['openCosplayModal'])

// Recupera los cosplays para la lista
onMounted(async () => {
    if (loggedInUserId) {
        try {
            const response = await axios.get(`http://localhost:3000/cosplayList?userId=${Cookies.get('userID')}`);
            cosplays.value = response.data;
            console.log(`Cosplays cargados en LateralNav:`);
            console.log(cosplays.value);
        } catch (error) {
            console.error('Error al cargar los cosplays del usuario:', error);
            // Manejar el error
        }
    } else {
        console.log('Usuario no logueado, no se pueden cargar los cosplays.');
        // Opcional: Redirigir al login
    }
});

function setSelectedCosplay(id) {
    localStorage.setItem('selectedCosplay', id);
    console.log(`Selected Cosplay ID: ${localStorage.getItem("selectedCosplay")}`)
}

</script>

<style scoped>

.lateralNav {
    min-width: 20rem;
    width: 20rem;
    height: auto;
    background-color: var(--mainColor);
    color: var(--secondaryColor);
    border-right: 2px solid var(--secondaryColor);
    padding: 20px;
    padding-top: 50px;
    box-sizing: border-box;
    overflow-y: auto;
    /* Por si la lista es larga */
}

.lateralNav h1 {
    margin-top: 0;
    margin-bottom: 2rem;
    font-size: 1.75rem;
}

.lateralNav input[type="text"] {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: none;
    border-radius: 5px;
    background-color: var(--complementaryColor);
    color: var(--secondaryColor);
    box-sizing: border-box;
    margin-top: 5px;
    margin-bottom: 2rem;
}

.lateralCosplayBox{
    display: flex;
    flex-direction: column;

    justify-content: center;
    align-items: left;

    font-size: 1.2rem;

    width: 100%;
    height: auto;
}

.lateralCosplayButton{
    width: 100%;
    height: 2rem;

    margin-bottom: 0.5rem;
    
    background-color: var(--mainColor);
    color: var(--secondaryColor);
    border-bottom: 2px solid var(--secondaryColor);

    transition: background-color 0.25s, border 0.25s;

}

.lateralCosplayButton:hover{
    cursor: pointer;

    background-color: var(--secondaryColor);
    color: var(--mainColor);
    border: 2px solid var(--secondaryColor);

}

.lateralCosplayButton h4{
margin-left: 0.75rem;
}
</style>