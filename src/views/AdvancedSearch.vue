<template>
  <div id="advanced-search" @keypress="keyPress">
    <div style="display: flex;">
      <router-link to="/"><img src="@/assets/heron_small.png" id="heron-logo" /></router-link>
      <h1>Advanced Search</h1>
    </div>
    <div id="inputs">
      <div class="row">
        <label for="name">Card Name</label>
        <input id="name" type="text" placeholder="Any words in the name" v-model="name">
      </div>
      <div class="row">
        <label for="text">Text</label>
        <input id="text" type="text" placeholder="Any text" v-model="text">
      </div>
      <div class="row">
        <label for="type">Type Line</label>
        <input id="type" type="text" placeholder="Any types" v-model="typeline">
      </div>
      <div class="row">
        <label for="mana">Mana Cost</label>
        <input id="mana" type="text" placeholder="Any mana symbols" v-model="mana">
      </div>
      <div class="row">
        <label for="color">Colors</label>
        <div style="display: flex" id="colors">
          <div class="checkbox">
            <input id="color-white" type="checkbox" v-model="color.w">
            <label for="color-white">
              <i class="ms ms-w ms-cost ms-shadow"></i>
              White
            </label>
          </div>
          <div class="checkbox">
            <input id="color-blue" type="checkbox" v-model="color.u">
            <label for="color-blue">
              <i class="ms ms-u ms-cost ms-shadow"></i>
              Blue
            </label>
          </div>
          <div class="checkbox">
            <input id="color-black" type="checkbox" v-model="color.b">
            <label for="color-black">
              <i class="ms ms-b ms-cost ms-shadow"></i>
              Black
            </label>
          </div>
          <div class="checkbox">
            <input id="color-red" type="checkbox" v-model="color.r">
            <label for="color-red">
              <i class="ms ms-r ms-cost ms-shadow"></i>
              Red
            </label>
          </div>
          <div class="checkbox">
            <input id="color-green" type="checkbox" v-model="color.g">
            <label for="color-green">
              <i class="ms ms-g ms-cost ms-shadow"></i>
              Green
            </label>
          </div>
          <div class="checkbox">
            <input id="color-colorless" type="checkbox" v-model="color.c">
            <label for="color-colorless">
              <i class="ms ms-c ms-cost ms-shadow"></i>
              Colorless
            </label>
          </div>
        </div>
        <div id="color-exun-container">
          <input id="color-exclude-unselected" type="checkbox" v-model="excludeUnselectedColors">
          <label for="color-exclude-unselected">Exclude Unselected</label>
        </div>
      </div>
      <div class="row" style='display: flex'>
        <label for="rarity">Rarity</label>
        <div class="checkbox">
          <input id="rarity-common" type="checkbox" v-model="rarity.common">
          <label for="rarity-common">Common</label>
        </div>
        <div class="checkbox">
          <input id="rarity-uncommon" type="checkbox" v-model="rarity.uncommon">
          <label for="rarity-uncommon">Uncommon</label>
        </div>
        <div class="checkbox">
          <input id="rarity-rare" type="checkbox" v-model="rarity.rare">
          <label for="rarity-rare">Rare</label>
        </div>
        <div class="checkbox">
          <input id="rarity-mythic" type="checkbox" v-model="rarity.mythic">
          <label for="rarity-mythic">Mythic Rare</label>
        </div>
      </div>
    </div>
    <div id="search-container">
      <button @click="advancedSearch()">Search with these options</button>
      <router-link to="/search/syntax">Advanced search syntax</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

function colorInputs() {
  const separator = excludeUnselectedColors.value ? '!' : ':';
  const query = Object.entries(color.value).map((entry) => {
    const [key, value] = entry;
    if (value) {
      return key;
    }
    return '';
  });
  if (query.length === 0) {
    return '';
  }
  return separator + query.join('');
}
function rarityInputs() {
  const query = Object.entries(rarity.value).map((entry) => {
    const [key, value] = entry;
    if (value) {
      return key;
    }
    return undefined;
  }).filter((x) => x !== undefined);
  return query.join(' OR r:');
}
function advancedSearch() {
  const inputs = {
    '': name.value,
    'o:': text.value,
    't:': typeline.value,
    'mana:': mana.value,
    c: colorInputs(),
    'r:': rarityInputs(),
  };

  const queries = Object.entries(inputs).map((entry) => {
    const [key, value] = entry;
    if (value) {
      return key + value;
    }
    return undefined;
  }).filter((x) => x !== undefined);

  if (queries.length === 0) {
    router.push('/search');
  } else {
    const url = `/search?q=(${queries.join(') (')})`;
    router.push(url);
  }
}

function keyPress(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    advancedSearch();
  }
}

const rarity = ref({
  common: false,
  uncommon: false,
  rare: false,
  mythic: false
});
const color = ref({
  w: false,
  u: false,
  b: false,
  r: false,
  g: false,
  c: false
});
const name = ref('');
const typeline = ref('');
const mana = ref('');
const text = ref('');
const excludeUnselectedColors = ref(false);
</script>

<style scoped>
@import "//cdn.jsdelivr.net/npm/mana-font@latest/css/mana.css";

#heron-logo {
  margin-top: 1.5em;
  padding-right: 15px;
}

#inputs {
  max-width: 1000px;
  margin: 0 auto;
}

.row {
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -webkit-flex-flow: row wrap;
  -ms-flex-flow: row wrap;
  flex-flow: row wrap;
  -webkit-box-pack: start;
  -webkit-justify-content: flex-start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  padding: 18px 0px;
  border-bottom: 1px solid #5552;
}

.row label {
  width: 18%;
  min-width: 180px;
  padding: 0.5em 0;
}

.row input {
  font-size: 14px;
  padding: 5px;
  max-width: 420px;
  flex-grow: 1;
  outline: none;
  border: 1px solid #5553;
  border-radius: 3px;
}

.row input:focus {
  border: 1px solid #555;
}

.row .checkbox {
  display: flex;
  height: 26px;
}

.row .checkbox label {
  padding: 0;
  align-items: center;
  display: flex;
  width: auto;
  margin-right: 20px;
  min-width: auto;
}

.row .checkbox label i {
  margin: 5px;
  padding: -1px;
}

.row input[type=checkbox] {
  width: 26px !important;
  height: 26px !important;
  -moz-appearance: none;
  -ms-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  background-color: #FEFEFE;
  -webkit-border-radius: 2px;
  border-radius: 2px;
  border: 1px solid #AEAEAE;
  color: #333;
  font-size: 20px;
  color: #555;
  display: flex;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  margin: 0 8px 0 0;
  transition: 60ms linear;
}

.row input[type=checkbox]:hover {
  border-color: #555;
  box-shadow: 2px 0px 4px 0 rgba(0, 0, 0, 0.3);
}

.row input[type=checkbox]:checked:before {
  content: "✓";
}

#color-exun-container {
  display: flex;
  margin-left: 400px;
}

#search-container {
  position: fixed;
  bottom: 0px;
  position: fixed;
  margin: 0 auto;
  left: 0;
  right: 0;
  padding: 30px;
  padding-left: 25%;
  background: white;
  width: 100%;
  border-top: 1px solid #ddd;
}

#search-container a {
  font-size: 12px;
  color: #555;
  margin-left: 20px;
  text-decoration: none;
}

#search-container a:hover {
  text-decoration: underline;
}

#search-container button {
  padding: 12px 14px;
  background: #f7f7f7;
  border: 1px solid #555;
  border-radius: 4px;
  font-size: 14px;
  transition: background 0.3s;
  outline: none;
  cursor: pointer;
}

#search-container button:hover {
  padding: 12px 14px;
  background: white;
  border: 1px solid #555;
  border-radius: 4px;
  font-size: 14px;
}

@media screen and (max-width: 600px) {
  .row {
    flex-direction: column;
  }

  #colors {
    flex-wrap: wrap;
    ;
  }

  #color-exun-container {
    margin-left: 0px;
  }

  .checkbox {
    width: 50%;
  }

  .row input[type=checkbox] {
    flex-grow: 0;
  }

  #search-container {
    display: flex;
    flex-direction: column;
    padding-left: 30px;
    width: auto;
  }

  #search-container a {
    margin-top: 10px;
    text-align: center;
  }
}
</style>
