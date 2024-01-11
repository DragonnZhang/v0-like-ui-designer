<script setup lang="ts">
import PromptInput from '~/components/MainPage/PromptInput.vue'

const config = useRuntimeConfig()

const userPrompt = ref('')

const generatedHTML = ref('')

async function getStreamResult() {
  const res = await fetch('/api/generateNewWebsite', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userPrompt: userPrompt.value
    })
  })

  const reader = res.body?.getReader()!

  async function read() {
    const { done, value } = await reader.read()
    if (done) {
      console.log('Done')
      reader.releaseLock()
      return
    }
    generatedHTML.value += new TextDecoder('utf-8').decode(value)
    read()

    return
  }

  if (reader) {
    generatedHTML.value = ''
    read()
  }
}

async function getDirectResult() {
  const res = await useFetch('/api/generateNewWebsite', {
    method: 'POST',
    body: {
      userPrompt: userPrompt.value
    }
  })

  console.log({
    'direct result': res.data.value
  })

  generatedHTML.value = (res.data.value as string) || ''
}

async function generatePage() {
  if (config.public.streaming) {
    getStreamResult()
  } else {
    getDirectResult()
  }
}
</script>

<template>
  <div>
    <PromptInput v-model="userPrompt" @submit="generatePage"></PromptInput>
  </div>
  <div class="show-template">
    <div class="inner">
      <div v-html="generatedHTML"></div>
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
    height: 700px;
  }
}
</style>
