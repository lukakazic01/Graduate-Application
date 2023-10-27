<template>
    <div class="text-center">
        <p class="fw-bold h2 mb-3">Pregled kupljenih patika</p>
    </div>
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr class="row100 head">
                        <th class="cell100 column1">Brend</th>
                        <th class="cell100 column2">Model</th>
                        <th class="cell100 column3">Ukupno Prodato</th>
                        <th class="cell100 column4">Ukupno Zaradjeno</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="sneaker in boughtSneakers" :key="sneaker.slika">
                        <td>{{sneaker.brend}}</td>
                        <td>{{sneaker.model}}</td>
                        <td>{{sneaker.ukupnoProdato}} komada</td>
                        <td>{{sneaker.ukupnoZaradjeno}} RSD</td>
                    </tr>
                </tbody>
            </table>
        </div>
</template>

<script setup>

import axios from "axios";
import {ref} from "vue";
const boughtSneakers = ref(null);

(async () => {
   const { data } = await axios.get('http://localhost:3000/boughtSneakers');
   boughtSneakers.value = data
})()
</script>

<style scoped>
table {
    border-collapse: collapse;
    box-shadow: 0 5px 20px 0px rgba(0, 0, 0, 0.1);
    width: 70%;
    border-radius: 10px;
}
thead {
    box-shadow: 0 5px 20px 0px rgba(0, 0, 0, 0.1);
}
tr {
    text-align: center;
    border-bottom: 1px solid #f2f2f2;
    display: table;
    width: 100%;
    table-layout: fixed;
}
th {
    color: crimson;
    padding: 10px;
}
td {
    padding-top: 1rem;
    padding-bottom: 1rem;
    color: #808080;
}
.table-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 30px;
}
tbody {
    display: block;
    max-height: 200px;
    overflow: auto;
}
</style>