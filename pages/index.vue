<script setup lang="ts">
import PromptInput from '~/components/MainPage/PromptInput.vue'

const userPrompt = ref('')

const generatedHTML = ref('')

async function generatePage() {
  const res = await fetch('/api/generateNewWebsite', {
    method: 'POST',
    body: `userPrompt=${userPrompt.value}`
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
</script>

<template>
  <div>
    <PromptInput v-model="userPrompt" @submit="generatePage"></PromptInput>
  </div>
  <div class="show-template" v-html="generatedHTML"></div>
</template>
