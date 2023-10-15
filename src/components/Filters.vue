<template>
    <div class="text-center d-flex justify-content-center flex-column">
        <div class="py-2 d-flex align-items-center">
            <label for="nike" class="h5 m-0 col-10 d-flex justify-content-start">Select Nike</label>
            <div class="col-2 d-flex justify-content-end">
                <input class="form-check-input h2" @change="updateFilters" type="checkbox" id="nike" value="nike" v-model="brands.brands">
            </div>
        </div>
        <div class="py-2 d-flex align-items-center">
            <label for="adidas" class="h5 m-0 col-10 d-flex justify-content-start">Select Adidas</label>
            <div class="d-flex col-2 justify-content-end">
                <input class="form-check-input h2" @change="updateFilters" type="checkbox" id="adidas" value="adidas" v-model="brands.brands">
            </div>
        </div>
        <div class="py-2 d-flex align-items-center">
            <label for="puma" class="h5 m-0 col-10 d-flex justify-content-start">Select Puma</label>
            <div class="d-flex col-2 justify-content-end">
                <input class="form-check-input h2" @change="updateFilters" type="checkbox" id="puma" value="puma" v-model="brands.brands">
            </div>
        </div>
        <div class="py-2 d-flex align-items-center">
            <label for="diadora" class="h5 m-0 col-10 d-flex justify-content-start">Select Diadora</label>
            <div class="col-2 d-flex justify-content-end">
                <input class="form-check-input h2" @change="updateFilters" type="checkbox" id="diadora" value="diadora" v-model="brands.brands">
            </div>
        </div>
    </div>
    <div class="text-center d-flex flex-column align-items-center mt-4">
        <label for="customRange2" class="form-label h4">Price</label>
        <input type="range" class="form-range w-100 p-4" @change="handlePrice" min="100" max="10000" id="customRange2" v-model="priceValue">
        <p class="fw-semibold">Od 100 do {{priceValue}}</p>
    </div>
</template>

<script setup>
import {ref} from "vue";

const emit = defineEmits(['filters']);
const priceValue = ref(100);
const brands = ref({brands: []})
const filters = ref([]);
const updateFilters = () => {
    if (brands.value.brands.length !== 0) {
        const priceFilter = filters.value.find(filter => filter?.cena)
        if(priceFilter) {
            filters.value = [brands.value, priceFilter];
        } else {
            filters.value = [brands.value];
        }
    } else {
        filters.value = filters.value.filter((filter) => !filter.brands);
    }
    emit('filters', filters.value)
}

const handlePrice = () => {
    filters.value = filters.value.filter((filter) => {
        return !filter.cena;
    })
    if (parseInt(priceValue.value) !== 100) {
        filters.value.push({cena:`100-${priceValue.value}`})
    }
    emit('filters', filters.value)
}
</script>

<style scoped>
input[type='checkbox'] {
    cursor: pointer;
}
</style>