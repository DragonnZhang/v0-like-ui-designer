<script setup lang="ts">
defineProps<{
  textareaDefaultPrompt: string
  loading: boolean
}>()
const modelValue = defineModel<string>({ required: true })
const emit = defineEmits<{
  submit: [value: string]
}>()

let isComposing = false

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
  } else if (event.key === 'Enter' && !isComposing) {
    submit(event)
  }
}
</script>

<template>
  <div class="prompt-input-container">
    <div class="prompt-input-wrapper" :class="{ loading }">
      <div class="prompt-input-content">
        <textarea
          @compositionstart="isComposing = true"
          @compositionend="isComposing = false"
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
          <button class="button-main" @click="$emit('submit', modelValue)">Confirm</button>
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

  .prompt-input-wrapper {
    background-color: var(--prompt-input-background);
    border-radius: 24px;
    width: 100%;
    padding: 0 0.75rem 0 1rem;
    position: relative;

    @media (prefers-color-scheme: light) {
      &::before {
        background: linear-gradient(
          90deg,
          #e2e2e2 0%,
          #e2e2e2 25%,
          #00dc82 50%,
          #36e4da 75%,
          #0047e1 100%
        );
      }
    }

    @media (prefers-color-scheme: dark) {
      &::before {
        background: linear-gradient(
          90deg,
          #303030 0%,
          #303030 25%,
          #00dc82 50%,
          #36e4da 75%,
          #0047e1 100%
        );
      }
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 24px;
      padding: 2px;
      width: 100%;
      background-size: 400% auto;
      opacity: 0.5;
      transition:
        background-position 0.3s ease-in-out,
        opacity 0.2s ease-in-out;
      -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
    }

    &:focus-within::before {
      background-position: -50% 0;
      opacity: 1;
    }

    &.loading {
      animation: glow 2s infinite;
    }

    .prompt-input-content {
      font-size: 12px;
      display: flex;
      align-items: center;

      .prompt-input-area {
        z-index: 999;
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

        &::-webkit-scrollbar {
          display: none;
        }
      }

      .buttons {
        z-index: 999;
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

  @keyframes glow {
    0% {
      box-shadow:
        0 0 1px #fff,
        0 0 2px #fff,
        0 0 3px #00f,
        0 0 4px #0ff,
        0 0 5px #00c9ff,
        0 0 6px #00c9ff,
        0 0 7px #00c9ff;
    }
    50% {
      box-shadow:
        0 0 2px #fff,
        0 0 3px #92fe9d,
        0 0 4px #92fe9d,
        0 0 5px #92fe9d,
        0 0 6px #92fe9d,
        0 0 7px #92fe9d,
        0 0 8px #92fe9d;
    }
    100% {
      box-shadow:
        0 0 1px #fff,
        0 0 2px #fff,
        0 0 3px #00f,
        0 0 4px #0ff,
        0 0 5px #00c9ff,
        0 0 6px #00c9ff,
        0 0 7px #00c9ff;
    }
  }
}
</style>
