<template>
    <div class="modal modal-overriden" v-if="props.isModalOpened">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Pregled patika</h5>
                    <button type="button" class="btn-close" @click="closeModal()"></button>
                </div>
                <div class="modal-body" v-if="cartStore.shoppingCart.length > 0">
                    <template v-for="item in cartStore.shoppingCart">
                        <div class="d-flex flex-row justify-content-center align-items-center">
                            <p class="col-3 text-center">{{item.BREND}}</p>
                            <p class="col-3 text-center">{{item.MODEL}}</p>
                            <p class="col-3 text-center">{{item._CENA}}</p>
                            <p class="col-3 text-center"><button type="button" class="btn-close" @click="deleteSneakers(item)"></button></p>
                        </div>
                    </template>
                </div>
                <div class="modal-body" v-else>
                    <p>Trenutno nemate patika za kupiti.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="closeModal()">Zatvori</button>
                    <button type="button"
                            class="btn btn-primary"
                            @click="buySneakers()"
                            :disabled="cartStore.shoppingCart.length === 0">
                            {{btnText}}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import {useCartStore} from "../../store/cart";
import {useToast} from "vue-toast-notification";
import axios from "axios";
import {useUserStore} from "../../store/user";
import {computed} from "vue";

const props = defineProps({isModalOpened: Boolean})
const emit = defineEmits(['closeModal', 'addNewSneakers']);
const cartStore = useCartStore();
const userStore = useUserStore();
const toast$ = useToast();
const btnText = computed(() => (sumOfAllPrizes() ? `kupi za ${sumOfAllPrizes()} RSD` : `nema patika`))
const closeModal = () => {
    emit('closeModal', false);
}

const sumOfAllPrizes = () => {
    let sum = 0
    cartStore.shoppingCart.forEach((item) => {
        sum += item._CENA;
    })
    return sum
}

const buySneakers = async () => {
    try {
        const { data } = await axios.post("http://localhost:3000/buy", {items: cartStore.shoppingCart, username: userStore.username})
        cartStore.setDeletingSneakers();
        emit('closeModal', false);
        emit('addNewSneakers', data)
        toast$.success("Uspesno ste kupili patike", {
            position: "bottom"
        })
    } catch (err) {
        console.log(err)
    }
}

const deleteSneakers = (sneaker) => {
    cartStore.deleteSelectedSneakers(sneaker)
}
</script>

<style scoped>
.modal-overriden {
    display: block;
    background: rgba(0,0,0, 0.5);
}
</style>