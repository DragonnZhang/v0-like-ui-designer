<script setup lang="ts">
const runtimeState = useRuntimeState()
</script>

<template>
  <div class="show-template">
    <div class="inner">
      <div v-html="runtimeState.generatedPageHtml"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.show-template {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .inner {
    width: 70%;
    height: 100px;
  }
}
</style>
