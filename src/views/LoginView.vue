<template>
    <div class="d-flex flex-column align-items-center">
        <h4 class="mb-3 mt-3">Login</h4>
        <div class=" mb-3 form-wrapper">
            <label>Username:</label>
            <input type="text" class="w-100" v-model="username" placeholder="Ukucajte username">
            <label class="mt-2">Password:</label>
            <input type="text" class="w-100" v-model="password" placeholder="Ukucajte sifru">
        <button class="btn btn-danger mt-3 text-white" @click="login()">Submit</button>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios'
import {ref} from "vue";
import {useToast} from "vue-toast-notification";
import {useUserStore} from "../../store/user";
import {useRouter} from "vue-router";

const username = ref('');
const password = ref('');
const $toast = useToast();
const store = useUserStore();
const router = useRouter();
const login = async () => {
    try{
        const {data} = await axios.post('http://localhost:3000/login', {
            username: username.value,
            password: password.value,
        }, {withCredentials: true})
        store.setUsername(data.username)
        $toast.success('Successfully logged in', {
            position: "bottom"
        })
        await router.push('/')
    } catch (err) {
        $toast.error('Wrong username or password', {
            position: "bottom"
        })
    }
}

</script>

<style scoped>
.form-wrapper {
    width: 350px;
    display: flex;
    flex-direction: column;
}
input {
    outline: none;
    padding: 5px;
}

input:focus{
    border: 2px solid crimson
}
</style>