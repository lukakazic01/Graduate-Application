<template>
    <div class="modal modal-overriden" v-if="props.isAddSneakersModalOpened">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Unesi nove patike</h5>
                    <button type="button" class="btn-close" @click="closeModal()"></button>
                </div>
                <div class="modal-body">
                    <div class="row mb-3">
                        <label class="col-3">brend:</label>
                        <input type="text" class="col-9" v-model="brend" name="brend"/>
                    </div>
                    <div class="row mb-3">
                        <label class="col-3">cena:</label>
                        <input type="text" class="col-9" v-model="cena" name="cena"/>
                    </div>
                    <div class="row mb-3">
                        <label class="col-3">broj patika:</label>
                        <input type="text" class="col-9" v-model="brojPatika" name="brojPatika"/>
                    </div>
                    <div class="row mb-3">
                        <label class="col-3">model:</label>
                        <input type="text" class="col-9" v-model="model" name="model"/>
                    </div>
                    <div class="row mb-3">
                        <label class="col-3">slika:</label>
                        <input type="file" class="col-9" name="image" ref="image" />
                    </div>
                    <div class="row mb-3">
                        <label class="col-3">kolicina:</label>
                        <input type="number" class="col-9" name="kolicina" min="1" v-model="kolicina"/>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="closeModal()">Zatvori</button>
                    <button type="submit" class="btn btn-primary" @click="saveSneakers()">Sacuvaj</button>
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
const image = ref(null);
const kolicina = ref(null);
const $toast = useToast();
const props = defineProps({isAddSneakersModalOpened: Boolean})
const emit = defineEmits(['closeModal', 'addNewSneakers']);
const closeModal = () => {
  emit('closeModal', false);
}

const saveSneakers = async () => {
    try{
        const { name, buffer } = await handleFile()
        const {data} = await axios.post('http://localhost:3000/addSneakers', {
            cena: cena.value,
            brojPatika: brojPatika.value,
            model: model.value,
            brend: brend.value,
            buffer: buffer,
            name: name,
            kolicina: kolicina.value
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

const handleFile = () => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(image.value.files[0]);
        reader.onload = () => {
            const data = {
                name: image.value.files[0].name,
                buffer: reader.result
            }
            resolve(data)
        }
})
}
</script>

<style scoped>
.modal-overriden {
    display: block;
    background: rgba(0,0,0, 0.5);
}
</style>