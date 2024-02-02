<script setup lang="ts">
import PromptInput from '~/components/MainPage/PromptInput.vue'

const config = useRuntimeConfig()

const userPrompt = ref('')

const runtimeState = useRuntimeState()

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
      reader.releaseLock()
      return
    }
    runtimeState.value.generatedPageHtml += new TextDecoder('utf-8').decode(
      value
    )
    await read()
  }

  if (reader) {
    runtimeState.value.generatedPageHtml = ''
    await read()
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

  runtimeState.value.generatedPageHtml = (res.data.value as string) || ''
}

async function generatePage() {
  runtimeState.value.isGeneratingPage = true
  try {
    if (config.public.streaming) {
      await getStreamResult()
    } else {
      await getDirectResult()
    }
  } catch (err) {
    console.log(err)
  } finally {
    runtimeState.value.isGeneratingPage = false
  }
}
</script>

<template>
  <div>
    <PromptInput
      textarea-default-prompt="A landing page for my design portfolio"
      :loading="runtimeState.isGeneratingPage"
      v-model="userPrompt"
      @submit="generatePage"
    ></PromptInput>
  </div>
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
