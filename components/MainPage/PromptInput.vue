<script setup lang="ts">
const modelValue = defineModel<string>({ required: true })
const emit = defineEmits<{
  submit: [value: string]
}>()

const textareaDefaultPrompt = 'A landing page for my design portfolio'

function autoComplete(event: KeyboardEvent) {
  event.preventDefault()

  const textarea = event.currentTarget as HTMLTextAreaElement

  if (textarea.value === '') {
    modelValue.value = textarea.placeholder
  }
}

function submit(event: KeyboardEvent) {
  event.preventDefault()

  const textarea = event.currentTarget as HTMLTextAreaElement

  if (textarea.value !== '') {
    emit('submit', modelValue.value)
  }
}

function keydownHandler(event: KeyboardEvent) {
  if (event.key === 'Tab') {
    autoComplete(event)
  } else if (event.key === 'Enter') {
    submit(event)
  }
}
</script>

<template>
  <div class="prompt-input-container">
    <div class="prompt-input-wrapper">
      <div class="prompt-input-content">
        <textarea
          @keydown="keydownHandler"
          class="prompt-input-area"
          :placeholder="textareaDefaultPrompt"
          v-model="modelValue"
          maxlength="1000"
          minlength="2"
          spellcheck="false"
          rows="1"
        />
        <div class="buttons">
          <button class="button-main" @click="$emit('submit', modelValue)">
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.prompt-input-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 26vh 0;

  .prompt-input-wrapper {
    background-color: var(--prompt-input-background);
    border-radius: 24px;
    width: 100%;
    max-width: 32rem;
    padding: 0 0.75rem 0 1rem;

    .prompt-input-content {
      font-size: 12px;
      display: flex;
      align-items: center;

      .prompt-input-area {
        resize: none;
        background-color: transparent;
        border: none;
        padding: 0.75rem 0.5rem 0.75rem 0.25rem;
        color: white;
        outline: 2px solid transparent;
        outline-offset: 2px;
        height: 47px;
        box-sizing: border-box;
        line-height: 2rem;
        min-width: 50%;
        flex: 1;
      }

      .button-main {
        border: none;
        display: inline-block;
        background-color: transparent;
        color: white;
        cursor: pointer;
        height: 38px;
      }
    }
  }
}
</style>
