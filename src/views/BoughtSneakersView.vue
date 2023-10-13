<template>
    <div class="text-center">
        <p class="fw-bold h2 mb-3">Pregled kupljenih patika</p>
    </div>
    <div class="wrapper mx-auto">
        <div class="d-flex justify-content-center gap-1">
            <div class="card col-3" v-for="sneaker in boughtSneakers" :key="sneaker.ID_PATIKA">
                <img :src="sneaker.slika" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title">{{sneaker.brend}} {{sneaker.model}}</h5>
                    <p class="card-text">Ukupno zaradjeno: {{sneaker.ukupnoZaradjeno}} RSD</p>
                    <p class="card-text">Ukupno prodato: {{sneaker.ukupnoProdato}}</p>
                </div>
            </div>
        </div>
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
.wrapper {
  max-width: 1250px;
}
</style>