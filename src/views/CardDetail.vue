<script setup lang="ts">
import { getCards } from '@/search';
import CardImage from '@/components/CardImage.vue';
import AddedCards from '@/components/AddedCards.vue';
import { onMounted, onUnmounted, ref } from 'vue';
import type { Card, CardBack } from '@/card';
import { useNotificationStore } from '@/stores/notifications';
import { useRoute, useRouter } from 'vue-router';

const shift = ref(false);
const card = ref<Card | undefined>(undefined);
const faces = ref<CardBack[]>([]);
const notifications = useNotificationStore();
const route = useRoute();
const router = useRouter();

function processText(input: string) {
  let text = input.replace(/(\(.*\))/g, '<i>$1</i>');
  text = text.replace(/^(\w+ )—/gm, '<i>$1</i>—');
  text = text.replace(/(.*)\n/g, '<p>$1</p>');
  text = text.replace(/{(.)}/g, "<abbr class='card-symbol card-symbol-$1'>{$1}</abbr>");
  text = text.replace(/\n/g, '<br/>');
  return text;
}

function keyListener(e: KeyboardEvent) {
  if (e.key === 'Shift') {
    if (e.type === 'keyup') {
      shift.value = false;
    } else if (e.type === 'keydown') {
      shift.value = true;
    }
  }
}

function addCardClicked() {
  if (card.value) {
    notifications.push(card.value.name, shift.value);
  }
}

onMounted(() => {
  const { name } = route.query;
  card.value = getCards().find((card) => card.simple_name === name);
  faces.value = [];
  let face: CardBack | undefined = card.value;
  while (face) {
    faces.value.push(face);
    face = face.back;
  }

  if (!card.value) {
    router.replace(`not-found?name=${name}`);
  }

  document.addEventListener('keydown', keyListener);
  document.addEventListener('keyup', keyListener);
});

onUnmounted(() => {
  document.removeEventListener('keydown', keyListener);
  document.removeEventListener('keyup', keyListener);
});
</script>

<template>
  <div id="card-detail" v-if="card">
    <h1 id="title">{{ card.name }}</h1>
    <div id="card-detail-box">
      <div style="display: flex; flex-direction: column;">
        <div id="card-container">
          <CardImage :card="card" size="large" />
        </div>
        <button id="add-to-deck" class="button" @click="addCardClicked()">
          Add to {{ shift? "Sideboard": "Deck" }}</button>
      </div>
      <div id="card-text">
        <div class="card-detail" v-for="face in faces" :key="face.name">
          <div class="card-element card-title">
            <b>{{ face.name }}</b>
            <div>
              <div v-if="face.cost">
                <abbr v-for="(letter, index) in face.cost" :key="index" class="card-symbol"
                  :class="`card-symbol-${letter}`"></abbr>
              </div>
            </div>
          </div>
          <p class="card-element">{{ face.typeline }}</p>
          <p class="card-element" v-html="face.html"></p>
          <i class="card-element" v-if="face.flavor" v-html="processText(face.flavor)"></i>
          <b class="card-element" v-if="face.power && face.toughness">
            {{ face.power }}/{{ face.toughness }}
          </b>
        </div>
      </div>
    </div>
  </div>
  <AddedCards />
</template>

<style scoped>
#card-detail {
  width: 80%;
  margin: 0 auto;
}

#card-detail-box {
  display: flex;
}

#card-container {
  width: 375px;
  height: 523px;
}

#card-info {
  width: 80%;
  margin: 0 auto;
}

#title {
  font-family: Beleren, serif;
  margin: 0 20%;
  padding: 22px 0;
}

#card-not-found {
  text-align: center;
}

p,
.card-detail>i,
b {
  font-family: MPlantin, serif;
  font-size: 14pt;
  margin: 5px 0;
  display: block;
}

.card-element {
  padding: 10px;
  margin-block-start: 0;
  margin-block-end: 0;
  border-top: 1px solid lightgray;
}

#card-text {
  margin-top: 50px;
  margin-left: -5px;
  width: 40%;
  min-width: 300px;
  padding: 10px 0;
  border-style: solid;
  border-color: rgb(51, 51, 51) lightgray;
  border-width: thick thin;
  border-radius: 5px;
  height: min-content;
  min-height: 200px;
}

.card-detail:first-child .card-title {
  border-top: none;
}

.card-detail:not(:first-child) .card-title {
  margin-top: 35px;
}

.card-title {
  display: flex;
  justify-content: space-between;
}

.card-title .card-symbol {
  width: 18px;
  height: 18px;
}

.button {
  padding: 8px 6px;
  margin: 0 auto;
  width: 50%;
  background-color: white;
  font-size: 14px;
  border: 1px solid #555;
  border-radius: 5px;
  margin-top: 15px;
  transition: 0.3s;
}

.button:hover {
  color: white;
  background-color: #555;
}

.button:focus {
  outline: none;
}


@media screen and (max-width: 800px) {
  #card-detail-box {
    flex-direction: column;
    width: min-content;
    margin: 0 auto;
  }

  #card-text {
    margin: 10px 0;
    width: 100%;
  }

  #title {
    margin: 0 auto;
    text-align: center;
  }

  #card-detail {
    width: auto;
  }
}


@font-face {
  font-family: Beleren;
  src: url("../assets/BelerenBold.woff");
}

@font-face {
  font-family: MPlantin;
  src: url("../assets/MPlantin.woff");
}

@font-face {
  font-family: MPlantin-Italic;
  font-style: italic;
  src: url("../assets/MPlantin-Italic.woff");
}
</style>

<style>
@import "@/assets/symbols.css";

.card-detail i {
  font-family: "MPlantin-Italic", "MPlantin", serif !important;
}
</style>
