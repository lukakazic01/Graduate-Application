import {defineStore} from "pinia";

export const useUserStore = defineStore('user', {
    state: () => ({
        username: '',
        role: ''
    }),
    actions: {
        setUsername(username) {
            this.username = username
        },
        setRole(role) {
            this.role = role;
        }
    }
})