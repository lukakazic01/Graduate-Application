import {defineStore} from "pinia";

export const useCartStore = defineStore('cart', {
    state: () => ({
        shoppingCart: []
    }),
    actions: {
        setShoppingCart(value) {
            this.shoppingCart.push(value)
        },
        buySneakers() {
            this.shoppingCart.splice(0);
        }
    }
})