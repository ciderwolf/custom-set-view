<template>
  <router-link :to="`/search?q=${query}`" class="code-example">
    <code>{{ query }}</code>
    <br />
    <slot />
  </router-link>
</template>

<script setup lang="ts">
defineProps<{ query: string }>()
</script>

<style scoped>
.code-example {
  border-left: 3px solid #555;
  border-radius: 2px;
  padding: 20px;
  -webkit-box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.07), 0 7px 17px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.07), 0 7px 17px 0 rgba(0, 0, 0, 0.1);
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  text-decoration: none;
  color: black;
  transition: 0.3s;
}

.code-example:hover {
  -webkit-box-shadow: 0 7px 10px 0 rgba(0, 0, 0, 0.07), 0 12px 17px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 0 7px 10px 0 rgba(0, 0, 0, 0.07), 0 12px 17px 0 rgba(0, 0, 0, 0.1);
}

.code-example code {
  line-height: 30px;
}

.code-example code {
  font-size: 18px;
}

.code-example i {
  color: gray;
}

code {
  background-color: #efefef;
  padding: 3px;
  border-radius: 2px;
}
</style>
