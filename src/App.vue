<template>
  <header>
      <nav class="nav bg-danger">
          <ul class="navbar-nav d-flex flex-row flex-grow-1">
              <li class="nav-item px-2 text-white"><RouterLink class="nav-link" to="/">Home</RouterLink></li>
              <li class="nav-item px-2 text-white"><RouterLink class="nav-link" to="/register">Register</RouterLink></li>
              <li class="nav-item px-2 text-white"><RouterLink class="nav-link" to="/login">Login</RouterLink></li>
              <li class="nav-item px-2 text-white"><RouterLink class="nav-link" to="/Q&A">Q&A</RouterLink></li>
          </ul>
          <div class="d-flex align-items-center" v-if="store.username">
              <p class="px-2 text-white m-0 pointer" @click="openModal()">
                  Cart <span v-if="countItemsInShoppingCart !== 0">{{countItemsInShoppingCart}}</span>
              </p>
              <p class="px-2 text-white nav-item m-0 pointer">{{store.username}}</p>
              <p class="px-2 text-white nav-item m-0 pointer" @click="logout()">Logout</p>
          </div>
      </nav>
      <CartModa :isModalOpened="isModalOpened"
                @close-modal="closeModal"/>
  </header>

  <RouterView />
</template>

<script setup>
import {RouterLink, RouterView, useRouter} from 'vue-router'
import {useUserStore} from "../store/user";
import CartModa from "@/components/CartModal.vue";
import {computed, inject, ref} from "vue";
import {useCartStore} from "../store/cart";

const cartStore = useCartStore();
const cookies = inject('$cookies');
const store = useUserStore()
const isModalOpened = ref(false);
const router = useRouter();
const countItemsInShoppingCart = computed(() => cartStore.shoppingCart.length)

function closeModal (value) {
    isModalOpened.value = value;
}

const openModal = () => {
    isModalOpened.value = true
}

const logout = () => {
    cookies.remove('token');
    store.setUsername(null)
    router.push('/login');
}
</script>

<style scoped>
.pointer {
    cursor: pointer
}
</style>
