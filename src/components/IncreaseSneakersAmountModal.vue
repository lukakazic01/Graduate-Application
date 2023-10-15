<template>
    <div class="modal modal-overriden" v-if="props.isIncreaseSneakersAmountModalOpened">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Povecaj kolicinu</h5>
                    <button type="button" class="btn-close" @click="closeModal()"></button>
                </div>
                <div class="modal-body">
                    <div class="row mb-3">
                        <label class="col-3">Kolicina:</label>
                        <input type="number"
                               class="col-9"
                               name="kolicinaZaDodati"
                               min="1"
                               v-model="kolicinaZaDodati"/>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" @click="addAmount()">Dodaj</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from "axios";
import {useSneakerStore} from "../../store/sneaker";
import {ref} from "vue";
import {useCartStore} from "../../store/cart";
import {useToast} from "vue-toast-notification";

const props = defineProps({ isIncreaseSneakersAmountModalOpened: Boolean })
const emit = defineEmits(['closeModal', 'updateSneakers'])
const sneakerStore = useSneakerStore();
const kolicinaZaDodati = ref(null);
const cartStore = useCartStore()
const $toast = useToast();
const addAmount = async () => {
    try{
        const id = sneakerStore.sneakerToBeDeleted.ID_PATIKA
        const {data} = await axios.post('http://localhost:3000/updateAmount', {id, kolicinaZaDodati: kolicinaZaDodati.value})
        cartStore.setDeletingSneakers();
        emit("updateSneakers", data)
        emit("closeModal")
        $toast.success('Successfully increased amount of sneakers', {
            position: "bottom"
        })
        kolicinaZaDodati.value = null;
    } catch(err) {
        console.log(err)
    }
}

const closeModal = () => {
    emit("closeModal")
}
</script>

<style scoped>
.modal-overriden {
    display: block;
    background: rgba(0,0,0, 0.5);
}
</style>