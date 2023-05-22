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
                            <p class="col-3 text-center">{{item.ID_PATIKA}}</p>
                            <p class="col-3 text-center">{{item.BREND}}</p>
                            <p class="col-3 text-center">{{item.MODEL}}</p>
                            <p class="col-3 text-center">{{item._CENA}}</p>
                        </div>
                    </template>
                </div>
                <div class="modal-body" v-else>
                    <p>Trenutno nemate patika za kupiti.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="closeModal()">Zatvori</button>
                    <button type="button" class="btn btn-primary" @click="buySneakers()">Kupi za {{sumOfAllPrizes()}} RSD</button>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import {useCartStore} from "../../store/cart";
import {useToast} from "vue-toast-notification";

const props = defineProps({isModalOpened: Boolean})
const emit = defineEmits(['closeModal', 'addNewSneakers']);
const cartStore = useCartStore();
const toast$ = useToast();
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

const buySneakers = () => {
    cartStore.buySneakers();
    emit('closeModal', false);
    toast$.success("Uspesno ste kupili patike", {
        position: "bottom"
    })
}
</script>

<style scoped>
.modal-overriden {
    display: block;
    background: rgba(0,0,0, 0.5);
}
</style>