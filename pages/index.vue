<script setup lang="ts">
import { ref } from 'vue'
import { inputValue, processClick, clearInfo, selectedElements } from '~/utils/elementSelection'
import { executeTask } from '~/utils/executeTask'
import PageTemplate from '~/components/MainPage/PageTemplate.vue'

const task = ref<string>('')

// listen mouseup event
let activeElement: Set<HTMLElement> = new Set()
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (activeElement.size !== 0 && !multipleChoiceMode) {
      return
    }
    if (activeElement.has(e.target as HTMLElement)) {
      return
    }
    activeElement.add(e.target as HTMLElement)
    processClick(e.target as HTMLElement)
  })
})

// use key to enable multiple choice
const multipleChoiceKey = 'MetaLeft'
const exitKey = 'Escape'
let multipleChoiceMode = false

onMounted(() => {
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.code === multipleChoiceKey) {
      multipleChoiceMode = true
    }
    if (e.code === exitKey) {
      clearInfo()
      activeElement.forEach((el) => {
        el.style.border = 'none'
      })
      activeElement.clear()
    }
  })
  document.addEventListener('keyup', (e: KeyboardEvent) => {
    if (e.code === multipleChoiceKey) {
      multipleChoiceMode = false
    }
  })
  document.addEventListener('mouseover', (e: MouseEvent) => {
    if (activeElement.size !== 0 && !multipleChoiceMode) return
    const el = e.target as HTMLElement
    if (el.tagName === 'BODY') return
    el.style.border = '0.5px dashed white'
  })
  document.addEventListener('mouseout', (e: MouseEvent) => {
    if (activeElement.has(e.target as HTMLElement)) return
    // 如果移出按钮则返回
    if (e.target === searchButtonRef.value) return
    ;(e.target as HTMLElement).style.border = 'none'
  })
})

async function handleClick(task: string, selectedElements: HTMLElement[]) {
  searchBarRef.value.classList.add('loading')
  await executeTask(task, selectedElements)
  searchBarRef.value.classList.remove('loading')
}

const searchButtonRef = ref()
const searchBarRef = ref()

function handleFocus() {
  searchBarRef.value.classList.add('focused')
}
function handleBlur() {
  searchBarRef.value.classList.remove('focused')
}
</script>

<template>
  <div
    class="search-bar"
    v-show="inputValue.show"
    :style="{ left: inputValue.left, top: inputValue.top }"
    ref="searchBarRef"
  >
    <div class="upper-area">
      <textarea
        class="text__input"
        v-model="task"
        placeholder="Your command here."
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <button
        class="confirm__button"
        @click="handleClick(task, selectedElements)"
        ref="searchButtonRef"
      >
        CONFIRM
      </button>
    </div>
  </div>

  <PageTemplate />
</template>

<style scoped lang="scss">
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

.search-bar {
  position: fixed;
  top: 10px;
  left: 10px;
  height: 128px;
  width: 400px;
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  box-sizing: content-box;

  &.loading {
    animation: glow 2s infinite;
  }

  .upper-area {
    display: flex;
    justify-content: center;
    height: 100%;
  }

  .text__input {
    border-radius: 4px 0 0 4px;
    user-select: all;
    width: 100%;
    padding: 5px;
    resize: none;
    background-color: #fff;
    border: none;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);

    &:focus {
      outline: none;
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    }
  }

  .confirm__button {
    background-color: #4caf50;
    color: #fff;
    width: 150px;
    border-left: none;
    border-radius: 0 4px 4px 0;
    font-size: 16px;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #45a049;
    }
  }
}
</style>
