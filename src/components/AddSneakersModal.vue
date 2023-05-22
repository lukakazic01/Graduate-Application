<template>
    <div class="modal modal-overriden" v-if="props.isModalOpened">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Unesi nove patike</h5>
                    <button type="button" class="btn-close" @click="closeModal()"></button>
                </div>
                <div class="modal-body">
                    <div class="row mb-3">
                        <label class="col-3">brend:</label>
                        <input type="text" class="col-9" v-model="brend"/>
                    </div>
                    <div class="row mb-3">
                        <label class="col-3">cena:</label>
                        <input type="text" class="col-9" v-model="cena"/>
                    </div>
                    <div class="row mb-3">
                        <label class="col-3">broj patika:</label>
                        <input type="text" class="col-9" v-model="brojPatika"/>
                    </div>
                    <div class="row">
                        <label class="col-3">model:</label>
                        <input type="text" class="col-9" v-model="model"/>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="closeModal()">Zatvori</button>
                    <button type="button" class="btn btn-primary" @click="saveSneakers()">Sacuvaj</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from "axios";
import {ref} from "vue";
import {useToast} from "vue-toast-notification";
const cena = ref(null);
const brend = ref('');
const model = ref('');
const brojPatika = ref(null);
const $toast = useToast();
const props = defineProps({isModalOpened: Boolean})
const emit = defineEmits(['closeModal', 'addNewSneakers']);
const closeModal = () => {
  emit('closeModal', false);
}

const saveSneakers = async () => {
    try{
        const {data} = await axios.post('http://localhost:3000/addSneakers', {
            cena: cena.value,
            brojPatika: brojPatika.value,
            model: model.value,
            brend: brend.value
        })
        emit('addNewSneakers', data)
        emit('closeModal', false)
        $toast.success('You added new pair of sneakers', {
            position: "bottom"
        })
    } catch(err) {
        $toast.error('Failed to add sneakers', {
            position: "bottom"
        })
    }
}
</script>

<style scoped>
.modal-overriden {
    display: block;
    background: rgba(0,0,0, 0.5);
}
</style>