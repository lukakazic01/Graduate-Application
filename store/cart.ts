import {defineStore} from "pinia";

export const useCartStore = defineStore('cart', {
    state: () => ({
        shoppingCart: []
    }),
    actions: {
        setShoppingCart(value) {
            this.shoppingCart.push(value)
        },
        setDeletingSneakers() {
            this.shoppingCart.splice(0);
        },
        deleteSelectedSneakers(value) {
            for(const [index, item] of this.shoppingCart.entries()){
                if(item.ID_PATIKA === value.ID_PATIKA) {
                    this.shoppingCart.splice(index, 1)
                    break;
                }
            }
        }
    }
})