<template>
  <div :id="card.simple_name"
      class="card-grid-item"
      :href="'/search/card?name=' + this.card.simple_name"
      :class="{ flipped }">
    <button v-if="card.dfc" @click="flip" class="flip-button"></button>
    <div v-if="card.dfc" class="card-faces" :class="{ flipped }">
      <img :src='`/img/transform/${card.simple_name}_front.jpg`' class="card card-front">
      <img :src='`/img/transform/${card.simple_name}_back.jpg`' class="card card-back">
    </div>
    <img :src="`/img/img/${this.card.simple_name}.jpg`" v-else class="card">
  </div>
</template>

<script>
export default {
  data() {
    return {
      flipped: false,
    };
  },
  methods: {
    flip(e) {
      this.flipped = !this.flipped;
      e.preventDefault();
    },
  },
  name: 'Card',
  props: ['card'],
};
</script>

<style>
.card-grid-item {
  display: block;
  position: relative;
  -webkit-perspective: 2000px;
  perspective: 2000px;
  transition: 0.1s;
  height: fill-available;
}

.card-grid-item .card-faces {
  z-index: 5;
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
  -webkit-transition: -webkit-transform 200ms;
  transition: -webkit-transform 200ms;
  -o-transition: -o-transform 200ms;
  transition: transform 200ms;
  transition: transform 200ms, -webkit-transform 200ms, -o-transform 200ms;
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.card-grid-item .card-faces.flipped {
  -webkit-transition: -webkit-transform 750ms;
  transition: -webkit-transform 750ms;
  -o-transition: -o-transform 750ms;
  transition: transform 750ms;
  transition: transform 750ms, -webkit-transform 750ms, -o-transform 750ms;
  -webkit-transform: rotateY(-180deg);
  transform: rotateY(-180deg);
}

.card {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  -webkit-box-shadow: 1px 1px 6px rgba(0,0,0,0.45);
  box-shadow: 1px 1px 6px rgba(0,0,0,0.45);
}

.card.card-front, .card.card-back {
  z-index: 5;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.card.card-front {
  -webkit-transform: rotateY(0deg);
  transform: rotateY(0deg);
}

.card.card-back {
  -webkit-transform: rotateY(180deg);
  transform: rotateY(180deg);
}

.flip-button {
  position: absolute;
  opacity: 0.60;
  background: white;
  -webkit-border-radius: 100%;
  border-radius: 100%;
  border: 2px solid #343242;
  display: block;
  height: 12.36%;
  width: 17.25%;
  padding: 3%;
  cursor: pointer;
  top: 26%;
  left: 70%;
  -webkit-transform-style: flat;
  transform-style: flat;
  -webkit-transition: background-color 200ms linear, opacity 50ms linear;
  -o-transition: background-color 200ms linear, opacity 50ms linear;
  transition: background-color 200ms linear, opacity 50ms linear;
  z-index: 1000;
  -webkit-transform: translateZ(0.01px);
  transform: translateZ(0.01px);
  outline: none;
}

.flip-button:hover {
  opacity: 1;
}

.card-grid-item .flip-button::after {
  content: url("~@/assets/flip-day.svg");
}
.card-grid-item.flipped .flip-button {
  border-color: #FFF;
  background-color: #343242;
}

.card-grid-item.flipped .flip-button::after {
  content: url("~@/assets/flip-night.svg");
}
</style>
