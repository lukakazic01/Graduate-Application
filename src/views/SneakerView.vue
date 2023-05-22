<template>
    <template v-if="sneaker.length > 0">
      <div v-for="data in sneaker" class="d-flex align-items-center flex-column">
        <h1>Brend: {{data.BREND}}</h1>
        <p>Model: {{data.MODEL}}</p>
        <p>Cena: {{data._CENA}} RSD</p>
        <p>Broj: {{data.BROJ_PATIKA}}</p>
      </div>
    </template>
    <template v-else>
        <div class="d-flex align-items-center flex-column">
           <h3 class="text-danger">Sneakers doesnt exist</h3>
        </div>
    </template>
</template>

<script setup>
import axios from "axios";
import {useRoute} from "vue-router";
import {ref} from "vue";
const route = useRoute();
const sneaker = ref([]);
(async() => {
    const param = route.params.id;
    const {data} = await axios.get('http://localhost:3000/sneaker', {params: {id: param}})
    sneaker.value = data;
})()
</script>

<style lang="scss" scoped>

</style>