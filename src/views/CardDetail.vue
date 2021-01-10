<template>
  <div id="card-detail" v-if="card">
    <h1 id="title">{{ card.name }}</h1>
    <div style="display: flex;">
        <div style="display: flex; flex-direction: column;">
            <div id="card-container">
              <Card :card="card"/>
            </div>
            <button id="add-to-deck" class="button" @click="addCardClicked()">Add to Deck</button>
        </div>
        <div id="card-text">
          <div class="card-detail" v-for="face in faces" :key="face.name">
            <div class="card-element card-title">
              <b>{{ face.name }}</b>
              <div>
                <div v-if="face.cost">
                  <abbr v-for="(letter, index) in face.cost" :key="index"
                    class="card-symbol" :class="`card-symbol-${letter}`"></abbr>
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
</template>

<script>
import { getCards } from '@/search';
import Card from '@/components/Card.vue';

export default {
  data() {
    return {
      card: null,
    };
  },
  methods: {
    addCardClicked() {
      // TODO: Add card to deck
    },
    processText(input) {
      let text = input.replace(/(\(.*\))/g, '<i>$1</i>');
      text = text.replace(/^(\w+ )—/gm, '<i>$1</i>—');
      text = text.replace(/(.*)\n/g, '<p>$1</p>');
      text = text.replace(/{(.)}/g, "<abbr class='card-symbol card-symbol-$1'>{$1}</abbr>");
      text = text.replace(/\n/g, '<br/>');
      return text;
    },
  },
  name: 'CardDetail',
  mounted() {
    const { name } = this.$route.query;
    this.card = getCards().find((card) => card.simple_name === name);
    this.faces = [];
    let face = this.card;
    while (face) {
      this.faces.push(face);
      face = face.back;
    }
  },
  components: { Card },
};
</script>

<style scoped>
@import "../assets/symbols.css";

#card-detail {
  width: 80%;
  margin: 8px auto;
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
  margin-left: 20%;
}

#card-not-found {
  text-align: center;
}

p, .card-detail > i, b {
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

.slide-in {
  overflow: hidden;
}

.slide-in.from-right {
  right: 0;
}

.slide-in.from-left {
  left: 0;
}

.slide-in-content {
  padding: 5px 20px;
  background: #eee;
  transition: transform .5s ease;
}

.slide-in.from-right .slide-in-content {
  transform: translateX(100%);
  -webkit-transform: translateX(100%);
}

.slide-in.from-left .slide-in-content {
  transform: translateX(-100%);
  -webkit-transform: translateX(-100%);
}

.slide-in.show .slide-in-content {
  transform: translateX(0%);
  -webkit-transform: translateX(0%);
}

.alert {
  width: 200px;
  background: white;
  padding: 10px;
  border-radius: 3px;
  border: 1px solid #555;
  margin: 3px 0px;
  cursor: pointer;
  background: #fffe;
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

@font-face {
  font-family: Beleren;
  src: url("../assets/BelerenBold.woff");
}

@font-face {
  font-family: MPlantin;
  src: url("../assets/MPlantin.woff");
}
</style>
