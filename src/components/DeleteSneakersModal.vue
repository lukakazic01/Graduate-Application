<template>
    <div class="modal modal-overriden" v-if="props.isDeleteSneakersModalOpened">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Obrisi patike</h5>
                    <button type="button" class="btn-close" @click="closeModal()"></button>
                </div>
                <div class="modal-body">
                    <div class="row mb-3">
                        <label class="col-3">Kolicina:</label>
                        <input type="number"
                               class="col-9"
                               name="novaKolicina"
                               :max="sneakerStore.sneakerToBeDeleted.kolicina"
                               min="1"
                               v-model="novaKolicina"/>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" @click="deleteSneakers()">Obrisi</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from "axios";
import {useSneakerStore} from "../../store/sneaker";
import {ref} from "vue";

const props = defineProps({ isDeleteSneakersModalOpened: Boolean })
const emit = defineEmits(['closeModal', 'updateSneakers'])
const sneakerStore = useSneakerStore();
const novaKolicina = ref(null);
const deleteSneakers = async () => {
    try{
        const id = sneakerStore.sneakerToBeDeleted.ID_PATIKA
        const {data} = await axios.delete('http://localhost:3000/delete', {params: {id, novaKolicina: novaKolicina.value}})
        emit("updateSneakers", data)
        emit("closeModal")
        novaKolicina.value = null;
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