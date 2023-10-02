<template>
    <div class="d-flex align-items-center flex-column mt-4 gap-2">
      <p v-if="store.role === 'ordinary'" class="fw-bolder fs-3 mb-4">Postavite pitanje</p>
      <p v-else class="fw-bolder fs-3 mb-4">Odgovorite na pitanja</p>
      <template v-if="allQuestions.length !== 0">
        <div v-for="(question, i) in allQuestions" class="w-75 position-relative">
            <span class="position-absolute answer" @click="handleOpening(question)" v-if="!question.isAnsweringBoxOpened && store.role === 'admin' && !question.ODGOVOR">Odgovori</span>
            <div class="d-flex flex-column">
                <div class="d-flex align-items-center">
                  <div class="fw-bold qa-index">{{i+1}}.</div>
                  <div class="qa-container p-2">
                      <p><span class="fw-bold">Korisnik:</span> {{question.POSTAVLJAC_PITANJA}}</p>
                      <p><span class="fw-bold">Pitanje:</span> {{question.PITANJE}}</p>
                      <p class="ms-3" v-if="question.ODGOVOR"><span class="fw-bold">Odgovor:</span> {{question.ODGOVOR}}</p>
                  </div>
                </div>
                <div class="d-flex w-full justify-content-end">
                    <div class="d-flex flex-column align-items-end answer-container">
                        <textarea class="question-input w-100 mt-3 p-2" v-model="answer" v-if="question.isAnsweringBoxOpened" placeholder="Odgovor">
                        </textarea>
                        <div class="d-flex w-100 gap-2 mt-1 mb-3" v-if="store.role === 'admin' && question.isAnsweringBoxOpened">
                            <button class="answer-btn w-50" @click="handleAnswering(question)">Posalji</button>
                            <button class="undo-btn w-50" @click="handleUndoing(question)">Ponisti</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </template>
      <template v-else><p>Jos nema pitanja</p></template>
      <div v-if="store.role === 'ordinary'" class="d-flex flex-column w-50 align-items-center mt-4">
        <textarea v-model="question" class="question-input w-100 p-2" placeholder="Pitanje"/>
        <button class="mt-3 w-25 q-btn" @click="handleSendingQuestion()">Send</button>
      </div>
    </div>
</template>

<script setup>
import {useUserStore} from "../../store/user";
import {computed, ref} from "vue";
import axios from "axios";

const store = useUserStore();
const question = ref('');
const allQuestions = ref([]);
const answer = ref('');

(async () => {
    let {data: questions} = await axios.get('http://localhost:3000/questions');
    questions = questions.map((item) => ({...item, isAnsweringBoxOpened: false}))
    allQuestions.value = questions
})()
const handleSendingQuestion = async () => {
    let {data: questions} = await axios.post('http://localhost:3000/q&a', {
        question: question.value,
        username: store.username
    })
    question.value = ''
    allQuestions.value = questions
}

const handleOpening = (question) => {
    question.isAnsweringBoxOpened = true
}

const handleUndoing = (question) => {
    question.isAnsweringBoxOpened = false;
}

const handleAnswering = async (question) => {
    question.isAnsweringBoxOpened = false;
    const {data: questions} = await axios.post('http://localhost:3000/answer', {
        answer: answer.value,
        id: question.ID_PITANJA
    })
    allQuestions.value = questions
    answer.value = ''
}
</script>

<style scoped>
.question-input {
    outline: none;
    border: 1px solid rgba(220,220,220);
    border-radius: 4px;
}
.question-input:focus {
  border: 2px solid rgb(78, 70, 221);
}

.q-btn {
    background-color: rgb(78, 70, 221);
    color: white;
    outline: none;
    border: none;
    border-radius: 4px;
}

.answer-btn {
    outline: none;
    border: none;
    background-color: seagreen;
    color: white;
    border-radius: 4px;
}

.qa-container {
    border: 1px solid rgba(220,220,220);
    border-radius: 5px;
    width: 90%;
}

.answer {
    bottom: 10px;
    color: rgba(0,0,0, 0.5);
    right: 5px;
    cursor: pointer;
    font-size: 0.625rem;
    font-weight: 600;
}

.undo-btn {
    outline: none;
    border: none;
    background-color: crimson;
    color: white;
    border-radius: 4px;
}

.qa-index {
    width: 10%;
    font-size: 2rem;
}

.answer-container {
    width: 90%;
}
</style>