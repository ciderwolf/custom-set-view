<template>
  <div id="card-detail">
    <link rel="stylesheet" href="@/assets/symbols.css">
    <Card :card="card"/>
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
  name: 'CardDetail',
  mounted() {
    const { name } = this.$route.query;
    this.card = getCards().find((card) => card.simple_name === name);
  },
  components: { Card },
};
</script>

<style>
#card-detail {
  width: 375px;
  height: 523px;
}
</style>
