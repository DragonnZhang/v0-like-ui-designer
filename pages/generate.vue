<script setup lang="ts">
import PromptInput from '~/components/MainPage/PromptInput.vue'
import GeneratedPage from '~/components/MainPage/GeneratedPage.vue'
import { useChat } from 'ai/vue'

const config = useRuntimeConfig()

const userPrompt = ref('')

const runtimeState = useRuntimeState()

const { messages, input, handleSubmit } = useChat({
  api: '/api/generateNewWebsite',
  headers: { 'Content-Type': 'application/json' },
  onFinish() {
    runtimeState.value.isGeneratingPage = false
  }
})

watch(messages, () => {
  runtimeState.value.generatedPageHtml = messages.value[messages.value.length - 1].content
})

async function getDirectResult() {
  const res = await useFetch('/api/generateNewWebsite', {
    method: 'POST',
    body: {
      userPrompt: userPrompt.value
    }
  })

  runtimeState.value.generatedPageHtml = (res.data.value as string) || ''
}

async function generatePage() {
  runtimeState.value.isGeneratingPage = true
  if (config.public.streaming) {
    input.value = userPrompt.value
    handleSubmit(new Event('submit'))
  } else {
    await getDirectResult()
    runtimeState.value.isGeneratingPage = false
  }
}
</script>

<template>
  <PromptInput
    textarea-default-prompt="A landing page for my design portfolio"
    :loading="runtimeState.isGeneratingPage"
    v-model="userPrompt"
    @submit="generatePage"
  ></PromptInput>
  <GeneratedPage />
</template>
