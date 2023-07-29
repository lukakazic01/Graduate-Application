<template>
  <div class="d-flex justify-content-center mt-5">
    <input type="text" placeholder="pretrazi patike" @input="getSearchedValues()" v-model="searchedValue">
      <button class="btn btn-primary ms-5" @click="openModal()">Dodaj nove patike</button>
  </div>
  <Filters @filters="handleFilters"/>
  <div class="row justify-content-center w-100">
      <div class="col-8">
        <table class="table mt-5 table-hover">
            <thead class="table-dark">
            <tr>
                <th scope="col">id</th>
                <th scope="col">brend</th>
                <th scope="col">model</th>
                <th scope="col">broj patike</th>
                <th scope="col">cena</th>
                <th scope="col">dodaj u korpu</th>
                <th scope="col">obrisi</th>
            </tr>
            </thead>
            <tbody>
              <tr v-for="sneaker in allSneakers" @click="showSneakersInDetail(sneaker.ID_PATIKA)" class="hover">
                  <td>{{sneaker.ID_PATIKA}}</td>
                  <td>{{sneaker.BREND}}</td>
                  <td>{{sneaker.MODEL}}</td>
                  <td>{{sneaker.BROJ_PATIKA}}</td>
                  <td>{{sneaker._CENA}}</td>
                  <td><button class="btn btn-success text-white" @click.stop="addToCart(sneaker)">Dodaj u korpu</button></td>
                  <td><button class="btn btn-danger text-white" @click.stop="deleteSneaker(sneaker.ID_PATIKA)">obrisi</button></td>
              </tr>
            </tbody>
        </table>
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
</style>