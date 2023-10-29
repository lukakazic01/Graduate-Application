<template>
    <div class="text-center">
        <p class="fw-bold h4 mb-3 mt-3">Trenutno stanje</p>
    </div>
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr class="row100 head">
                        <th class="cell100 column1">Brend</th>
                        <th class="cell100 column2">Model</th>
                        <th class="cell100 column3">Kolicina</th>
                        <th class="cell100 column4">Cena</th>
                        <th class="cell100 column4">Broj Patika</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="sneaker in currentState" :key="sneaker.slika">
                        <td>{{sneaker.BREND}}</td>
                        <td>{{sneaker.MODEL}}</td>
                        <td>{{sneaker.kolicina === 1 ? `${sneaker.kolicina} komad` : `${sneaker.kolicina} komada`}}</td>
                        <td>{{sneaker._CENA}} RSD</td>
                        <td>{{sneaker.BROJ_PATIKA}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    <div class="text-center mt-5">
        <p class="fw-bold h4 mb-3 mt-3">Pregled kupljenih patika po korisniku i datumu</p>
    </div>
    <div class="d-flex justify-content-center">
        <div class="date-picker-wrapper">
            <VueDatePicker @cleared="clearQueryParams()"
                           placeholder="Odaberite datum"
                           class="date-picker"
                           v-model="date"
                           min-date="'2023-10-25'"
                           :max-date="new Date()"
                           :partial-range="false" range />
            <p class="m-0 ms-3 profit">Ukupan profit: {{wholeProfit}} RSD</p>
        </div>
    </div>
    <div class="table-wrapper">
        <table>
            <thead class="second-thead">
                <tr class="row100 head">
                    <th class="second-th">Korisnik</th>
                    <th class="second-th">Broj Patika</th>
                    <th class="second-th">Brend</th>
                    <th class="second-th">Model</th>
                    <th class="second-th">Cena</th>
                    <th class="second-th">Kolicina</th>
                    <th class="second-th">Kupljene su:</th>
                </tr>
            </thead>
            <tbody>
            <tr v-for="sneaker in boughtSneakerByUser">
                <td>{{sneaker.email}}</td>
                <td>{{sneaker.broj_patika}}</td>
                <td>{{sneaker.brend}}</td>
                <td>{{sneaker.model}}</td>
                <td>{{sneaker.cena}} RSD</td>
                <td>{{sneaker.kolicina}}</td>
                <td>{{sneaker.datum}}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>

import axios from "axios";
import {computed, ref, watch} from "vue";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import {useRoute, useRouter} from "vue-router";

const date = ref();
const currentState = ref(null);
const boughtSneakerByUser = ref(null);
const router = useRouter();
const route = useRoute();
const wholeProfit = ref(0);

const formatToValidDate = (date) => {
    return date.split('/').reverse().join('-').replaceAll('/', '-');
}

(() => {
    if(route.query.date) {
        const currentDateFilter = route.query.date;
        const [firstDate, secondDate] = currentDateFilter.split('-');
        date.value = [new Date(formatToValidDate(firstDate)), new Date(formatToValidDate(secondDate))];
    }
    const firstPromise = axios.get('http://localhost:3000/');
    const secondPromise = axios.get('http://localhost:3000/boughtSneakersByUserAndDate', {params: {dateRange: route.query?.date}})
    Promise.all([firstPromise, secondPromise]).then((res) => {
        const { data: currState } = res[0]
        const { data: onlyByUser } = res[1];
        currentState.value = currState.result;
        boughtSneakerByUser.value = onlyByUser;
    })
})()

const format = (dateRange) => {
    if(!dateRange) return null;
    const [firstDate, secondDate] = dateRange
    const formattedFromDate = `${firstDate.getDate()}/${firstDate.getMonth() + 1}/${firstDate.getFullYear()}`
    const formattedToDate = `${secondDate.getDate()}/${secondDate.getMonth() + 1}/${secondDate.getFullYear()}`
    return { formattedFromDate, formattedToDate}
}

const clearQueryParams = async () => {
    await router.replace({ query: null })
    const { data } = await axios.get('http://localhost:3000/boughtSneakersByUserAndDate', {params: {dateRange: route.query.date}})
    boughtSneakerByUser.value = data
}

watch(date, async (newDate) => {
    const formattedDates = format(newDate)
    if(!formattedDates) return;
    const {formattedFromDate, formattedToDate} = formattedDates;
    await router.push({path: '', query: {date: `${formattedFromDate}-${formattedToDate}`}})
    const { data } = await axios.get('http://localhost:3000/boughtSneakersByUserAndDate', {params: {dateRange: route.query.date}});
    boughtSneakerByUser.value = data;
})
watch(boughtSneakerByUser, (newBoughtSneakersByUser) => {
    wholeProfit.value = newBoughtSneakersByUser.reduce((acc, item) => acc += item.cena ,0)
})
</script>

<style scoped>
table {
    border-collapse: collapse;
    box-shadow: 0 5px 20px 0px rgba(0, 0, 0, 0.1);
    width: 70%;
    border-radius: 10px;
}
thead {
    box-shadow: 0 5px 20px 0px rgba(0, 0, 0, 0.1);
    background-color: #6c7ae0;
    border-radius: 20px;
}
tr {
    text-align: center;
    border-bottom: 1px solid #f2f2f2;
    display: table;
    width: 100%;
    table-layout: fixed;
}
th {
    color: white;
    padding: 10px;
}
td {
    padding-top: 1rem;
    padding-bottom: 1rem;
    color: #808080;
}
.table-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 30px;
    border-radius: 20px;
}
tbody {
    display: block;
    max-height: 170px;
    overflow: auto;
}
::-webkit-scrollbar
{
    height:3px;
    width: 7px;
}
::-webkit-scrollbar-track
{
    width: 5px;
}
::-webkit-scrollbar-thumb
{
    background-color: rgba(220,220,220);
    border-radius: 20px;
}
.second-thead {
    background-color: #32de84;
}
.date-picker-wrapper {
    width: 70%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.date-picker {
    width: 30%;
}
.profit {
    color: #808080;
    font-weight: 600;
}
</style>