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

  generatedHTML.value = (res.data.value as string) || ''
}

async function generatePage() {
  if (config.streaming) {
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
  <div class="show-template" v-html="generatedHTML"></div>
</template>
