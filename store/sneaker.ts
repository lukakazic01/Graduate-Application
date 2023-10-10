import {defineStore} from "pinia";

export const useSneakerStore = defineStore('sneaker', {
    state: () => ({
        sneakerToBeDeleted: {}
    }),
    actions: {
        setSneaker(value) {
            this.sneakerToBeDeleted = value
        }
    }
})