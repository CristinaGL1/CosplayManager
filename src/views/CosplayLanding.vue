<template>

    <nav>
        <NavigationBar :userLogged="userLogged" @toggle-add-cosplay="showAddCosplay = !showAddCosplay"
            @logout-user="logout" />

        <div class="cosplay-area">
            <AddCosplay v-if="showAddCosplay" @cosplay-agregado="loadCosplays"
                @ocultar-formulario="showAddCosplay = false" />
            <CosplayList :cosplays="cosplayList" @cosplay-eliminado="handleCosplayEliminado" />
        </div>

        <div v-if="mensajeLogout" class="notification">{{ mensajeLogout }}</div>
    </nav>

    <div class="cl">

        <section class="lateralNav">
            <h1>hola</h1>
        </section>

        <section class="cosplayGrid">
        </section>

        <section class="gridScroll">

        </section>

    </div>




</template>

<script setup>

    import NavigationBar from '../components/NavigationBar.vue';
    import { ref, onMounted } from 'vue';
    import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
    import { getCosplays } from '../firestore';
    import { useRouter } from 'vue-router';


    const router = useRouter();
    const cosplayList = ref([]);
    const showAddCosplay = ref(false);
    const userLogged = ref(false);
    const mensajeLogout = ref('');
    let cosplaysLoaded = false;

    const loadCosplays = async () => {
        cosplayList.value = await getCosplays();
        cosplaysLoaded = true;
    };

    const logout = async () => {
        console.log('Función logout en Dashboard llamada');
        await signOut(getAuth());
        mensajeLogout.value = "Sesión cerrada";
        router.push('/'); // Redirigir al login
    };

    const handleCosplayEliminado = (id) => {
        cosplayList.value = cosplayList.value.filter(cosplay => cosplay.id !== id);
    };

    onMounted(() => {
        onAuthStateChanged(getAuth(), (user) => {
            userLogged.value = !!user;
            if (user) {
                loadCosplays();
            }
        });
    });
</script>

<style scoped>
    #app {
        height: 100%;
        width: 100%;
    }

    .cl {
        height: 100%;
        width: 100%;

    }

    .lateralNav {
        height: 100%;
        width: 15vw;

        background-color: var(--mainColor);
        border-right: 2px solid var(--secondaryColor);

        .cosplayGrid {
            width: 75vw;

        }

        .grdiScroll {
            width: 10vw;
            background-color: var(--mainColor);
            border-right: 2px solid var(--secondaryColor);
        }
    }
</style>