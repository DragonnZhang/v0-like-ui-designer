<script setup lang="ts">
const routes = [
  {
    url: 'page1',
    name: 'page1'
  },
  {
    url: 'page2',
    name: 'page2'
  },
  {
    url: 'page3',
    name: 'page3'
  }
]
</script>

<template>
  <div id="app">
    <div id="choice">
      <a v-for="route in routes" :key="route.url" :href="route.url" class="choice__item">{{
        route.name
      }}</a>
    </div>
    <NuxtPage />
  </div>
</template>

<style src="~/assets/css/global.scss"></style>
<style scoped lang="scss">
#app {
  height: 100vh;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  #choice {
    width: 100vw;
    height: 5%;
    display: flex;

    .choice__item {
      flex-grow: 1;
      display: inline-block;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
      background-color: #f5f5f5;
      color: #333;
    }
  }
}
</style>
