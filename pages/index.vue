<script setup lang="ts">
import PromptInput from '~/components/MainPage/PromptInput.vue'

const userPrompt = ref('')

const generatedHTML = ref('')

async function generatePage() {
  const res = await useFetch('/api/generateNewWebsite', {
    method: 'POST',
    body: {
      userPrompt: userPrompt.value
    }
  })

  generatedHTML.value = res.data.value || ''
}
</script>

<template>
  <div>
    <PromptInput v-model="userPrompt" @submit="generatePage"></PromptInput>
  </div>
  <div v-html="generatedHTML"></div>
</template>
