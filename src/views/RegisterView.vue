<template>
    <div class="d-flex flex-column align-items-center">
      <h4 class="mb-3 mt-3">Register</h4>
        <div class="row mb-3 form-wrapper">
          <label class="col-3">Username:</label>
          <input type="text" class="col-9" v-model="username">
        </div>
        <div class="row form-wrapper">
          <label class="col-3">Password:</label>
          <input type="text" class="col-9" v-model="password">
        </div>
        <button class="btn btn-danger mt-3 text-white" @click="register()">Submit</button>
    </div>
</template>

<script setup>
import axios from 'axios'
import { ref } from "vue";
import { useToast } from "vue-toast-notification";
import {useRouter} from "vue-router";

const username = ref('');
const password = ref('');
const error = ref(false);
const $toast = useToast();
const router = useRouter();
const register = async () => {
    try {
        await axios.post('http://localhost:3000/register', {
            username: username.value,
            password: password.value
        })
        await router.push('/login');
    } catch(err) {
        console.log(err.message)
        $toast.error('User already exists', {
            position: "bottom"
        })
    }
}

</script>

<style scoped>
.form-wrapper {
  width:350px;
}
</style>