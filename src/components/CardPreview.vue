<template>
  <div>
    <img :style="style" class="card-preview" :src="`/img/img/${card.simpleName}.jpg`"/>
    <p
      class="card-line"
      @mouseleave="mouseLeave"
      @mouseover="mouseOver"
      @mousemove="mouseMove"
    >{{ card.count }} {{ card.name }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      style: {
        display: 'none',
        left: 0,
        top: 0,
      },
      height: 128,
    };
  },
  methods: {
    normalizePreviewY(e) {
      let newY = e.pageY;
      if (newY + this.height > window.innerHeight + window.scrollY) {
        newY = window.innerHeight + window.scrollY - this.height;
      }
      return newY;
    },
    mouseLeave() {
      this.style.display = 'none';
    },
    mouseOver(e) {
      this.style.display = 'inline';
      this.style.left = e.pageX.toString();
      this.style.top = `${this.normalizePreviewY(e)}px`;
    },
    mouseMove(e) {
      this.style.left = `${e.pageX.toString()}px`;
      this.style.top = `${this.normalizePreviewY(e)}px`;
    },
  },
  props: ['card'],
  name: 'CardPreview',
};
</script>

<style scoped>
.card-preview {
  display: none;
  background-size: 224px auto;
  height: 310px;
  position: absolute;
  z-index: 2;
  border: 3px solid white;
  border-radius: 5px;
  pointer-events: none;
}

.card-line {
  margin-top: 0;
  margin-bottom: 0;
}
</style>
