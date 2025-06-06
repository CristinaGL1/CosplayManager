<template>
    <section class="lateralNav">
        <h1>Lista de Cosplays</h1>
        <input type="text" placeholder="Buscar cosplay"></input>
        <ul>
            <li></li>
        </ul>
    </section>
</template>

<style scoped>
.lateralNav {
    width: 20vw;
    background-color: var(--mainColor);
    color: var(--secondaryColor);
    border-right: 2px solid var(--mainColor);
    padding: 20px;
    box-sizing: border-box;
    overflow-y: auto;
    /* Por si la lista es larga */
}

.lateralNav h1 {
    margin-top: 0;
    margin-bottom: 15px;
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
    margin-top: 20px;
}

.lateralNav ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.lateralNav li {
    padding: 10px 0;
    border-bottom: 1px solid #444;
    cursor: pointer;
}

.lateralNav li:last-child {
    border-bottom: none;
}

.list-item-link {
    cursor: pointer;
}
</style>