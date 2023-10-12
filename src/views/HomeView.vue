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
                  <p>Kolicina: {{sneaker.kolicina}}</p>
                  <div class="mt-3">
                    <button class="btn btn-success text-white me-3" @click.stop="addToCart(sneaker)" :disabled="sneaker.doesAmountExceeds">Dodaj u korpu</button>
                    <button class="btn btn-success text-white me-3" @click.stop="openIncreaseSneakersAmountModal(sneaker)">Dodaj kolicinu</button>
                    <button class="btn btn-danger text-white" @click.stop="openDeleteSneakersModal(sneaker)">Obrisi</button>
                  </div>
              </div>
          </div>
      </div>
  </div>
  <AddSneakersModal :isAddSneakersModalOpened="isAddSneakersModalOpened"
          @close-modal="closeModal"
          @add-new-sneakers="updateCards"></AddSneakersModal>
  <DeleteSneakersModal :isDeleteSneakersModalOpened="isDeleteSneakersModalOpened"
                        @close-modal="closeDeleteSneakersModal()"
                        @update-sneakers="updateCards"/>
  <IncreaseSneakersAmountModal :is-increase-sneakers-amount-modal-opened="isIncreaseSneakersAmountModalOpened"
                                @close-modal="closeIncreaseSneakersAmountModal"
                                @update-sneakers="updateCards"/>
</template>
<script setup>
import axios from 'axios'
import {ref, watch} from "vue";
import router from "@/router";
import {useCartStore} from "../../store/cart";
import Filters from "@/components/Filters.vue";
import {useRoute} from "vue-router";
import AddSneakersModal from "@/components/AddSneakersModal.vue";
import DeleteSneakersModal from "@/components/DeleteSneakersModal.vue";
import {useSneakerStore} from "../../store/sneaker";
import IncreaseSneakersAmountModal from "@/components/IncreaseSneakersAmountModal.vue";
const props = defineProps(['allSneakers'])
const allSneakers = ref([]);
const searchedValue = ref('');
const timeout = ref(null);
const isAddSneakersModalOpened = ref(false);
const isDeleteSneakersModalOpened = ref(false)
const isIncreaseSneakersAmountModalOpened = ref(false);
const cartStore = useCartStore();
const sneakerStore = useSneakerStore();

(async() => {
    try {
      let {data} = await axios.get('http://localhost:3000/')
      data.result = data.result.map((item) => ({...item, doesAmountExceeds: false}))
      allSneakers.value = data.result
      recalculateIfSneakerAmountIsExceeded(cartStore.shoppingCart)
    } catch(err) {
        //
    }
})()

const getSearchedValues = async () => {
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

const showSneakersInDetail = async (id) => {
   await router.push(`/sneaker/${id}`)
}

const openModal = () => {
    isAddSneakersModalOpened.value = true
}

function closeModal (value) {
    isAddSneakersModalOpened.value = value;
}

function updateCards (data) {
    allSneakers.value = data
}

const openDeleteSneakersModal = (sneaker) => {
    sneakerStore.setSneaker(sneaker)
    isDeleteSneakersModalOpened.value = true;
}

const openIncreaseSneakersAmountModal = (sneaker) => {
    sneakerStore.setSneaker(sneaker)
    isIncreaseSneakersAmountModalOpened.value = true;
}

const closeDeleteSneakersModal = () => {
    isDeleteSneakersModalOpened.value = false
}

const closeIncreaseSneakersAmountModal = () => {
    isIncreaseSneakersAmountModalOpened.value = false;
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

const recalculateIfSneakerAmountIsExceeded = (state) => {
    const grouped = [];
    if (!state.length) {
        allSneakers.value.forEach((item) => {
            item.doesAmountExceeds = false
        })
        return;
    }
    state.forEach((item) => {
        const matchingItem = grouped.find((sneaker) => sneaker.id === item.ID_PATIKA);
        if (matchingItem) {
            matchingItem.foundedAmount += 1;
        } else {
            grouped.push({id: item.ID_PATIKA, foundedAmount: 1, originalAmount: item.kolicina})
        }
    })
    for (let item of grouped) {
        const matchingSneaker = allSneakers.value.find((sneaker) => sneaker.ID_PATIKA === item.id)
        if(item.foundedAmount === item.originalAmount) {
            matchingSneaker.doesAmountExceeds = true
        } else {
            matchingSneaker.doesAmountExceeds = false
        }
    }
}

watch(() => props.allSneakers, (newSneakers) => allSneakers.value = newSneakers)

cartStore.$subscribe((mutation, state) => {
    recalculateIfSneakerAmountIsExceeded(state.shoppingCart)
})
</script>
<style>
.card-container {
    width: calc(33.33333% - 1.5rem);
}
.card-container:hover {
    cursor: pointer;
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