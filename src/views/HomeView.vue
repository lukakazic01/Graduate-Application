<template>
  <div class="d-flex justify-content-center mt-5">
    <input type="text" placeholder="pretrazi patike" @input="getSearchedValues()" v-model="searchedValue">
      <button class="btn btn-primary ms-5" @click="openModal()">Dodaj nove patike</button>
  </div>
  <Filters @filters="handleFilters"/>
  <div class="row">
      <div class=" mt-4 d-flex w-100 flex-wrap gap-4 justify-content-center">
          <div class="card hover card-container" v-for="sneaker in allSneakers" @click="showSneakersInDetail(sneaker.ID_PATIKA)">
              <div class="card-wrapper card-img-top">
                <img :src="sneaker.slika" class="img-card" alt="slika" />
              </div>
              <div class="card-body">
                  <h5 class="card-title">{{sneaker.BREND}} {{sneaker.MODEL}}</h5>
                  <p>Broj: {{sneaker.BROJ_PATIKA}}</p>
                  <p>Cena: {{sneaker._CENA}} RSD</p>
                  <div class="mt-3">
                    <button class="btn btn-success text-white me-3" @click.stop="addToCart(sneaker)">Dodaj u korpu</button>
                    <button class="btn btn-danger text-white" @click.stop="deleteSneaker(sneaker.ID_PATIKA)">obrisi</button>
                  </div>
              </div>
          </div>
      </div>
  </div>
  <Modal :isModalOpened="isModalOpened"
          @close-modal="closeModal"
          @add-new-sneakers="updateTable"></Modal>
</template>
<script setup>
import axios from 'axios'
import { ref } from "vue";
import router from "@/router";
import Modal from "@/components/AddSneakersModal.vue";
import {useCartStore} from "../../store/cart";
import Filters from "@/components/Filters.vue";
import {useRoute} from "vue-router";
const allSneakers = ref([]);
const searchedValue = ref('');
const timeout = ref(null);
const isModalOpened = ref(false);
const cartStore = useCartStore();
const route = useRoute();
(async() => {
    try {
      const {data} = await axios.get('http://localhost:3000/')
      allSneakers.value = data.result
    } catch(err) {
        //
    }
})()

const getSearchedValues = async () => {
    const {data} = await axios.get('http://localhost:3000/')
   if(timeout.value) {
       clearTimeout(timeout.value)
   }
   timeout.value = setTimeout(() => {
        axios.get('http://localhost:3000/search', {params: {
               searched: searchedValue.value
        }})
        .then(res => {allSneakers.value = res.data})
        .catch(err => console.log(err));
   }, 400)
}

const deleteSneaker = async (id) => {
    try{
      const {data} = await axios.delete('http://localhost:3000/delete', {params: {id}})
      allSneakers.value = data
    } catch(err) {

    }
}

const showSneakersInDetail = async (id) => {
   await router.push(`/sneaker/${id}`)
}

const openModal = () => {
    isModalOpened.value = true
}

function closeModal (value) {
    isModalOpened.value = value;
}

function updateTable (data) {
    allSneakers.value = data
}

const addToCart = (sneaker) => {
    cartStore.setShoppingCart(sneaker);
}

const handleFilters = async (filters) => {
  await handleQueryParams(filters)
  const {data: filtered} = await axios.get('http://localhost:3000/filters', {params: {
      filters
   }});
  allSneakers.value = filtered
}

const handleQueryParams = async (filters) => {
    const doesBrandsExist = filters.some(filter => filter.brands);
    const doesPriceExist = filters.some(filter => filter.cena);
    if (filters.length === 0) {
        return await router.push('');
    }
    if (doesBrandsExist || doesPriceExist) {
        const brands = filters.filter(filter => filter.brands);
        const price = filters.find(filter => filter.cena)
        await router.push({path: '', query: {
                brend: brands[0]?.brands.join(','),
                cena: price?.cena
        }})
    }

}
</script>
<style>
.hover:hover {
    cursor: pointer;
}
.card-container {
    width: calc(33.33333% - 1.5rem);
}
.img-card {
    max-width: 100%;
    width: auto;
}
.card-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0,0,0);
}
</style>