<script setup lang="ts">
import { ref } from 'vue'
import {
  inputValue,
  processClick,
  clearInfo,
  selectedElements,
  addBorderStyle,
  resetBorderStyle
} from '~/utils/elementSelection'
import { executeTask } from '~/utils/executeTask'
import PromptInput from '~/components/MainPage/PromptInput.vue'

const task = ref<string>('')

function isIrrelevantElement(el: HTMLElement): boolean {
  if (el.tagName === 'BODY') return true
  if (
    el.id === 'app' ||
    document.querySelector('#prompt__input')?.contains(el) ||
    !(el.id !== 'main__container' && document.querySelector('#main__container')?.contains(el))
  )
    return true
  return false
}

// listen mouseup event
let activeElement: Set<HTMLElement> = new Set()
onMounted(() => {
  document.addEventListener('click', (e) => {
    const el = e.target as HTMLElement
    if (activeElement.has(el)) {
      activeElement.delete(el)
      processClick(el)
      return
    }
    if (activeElement.size !== 0 && !multipleChoiceMode) {
      return
    }
    if (isIrrelevantElement(el)) return

    activeElement.add(el)
    processClick(el)
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
        resetBorderStyle(el)
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
    if (isIrrelevantElement(el)) return

    addBorderStyle(el)
  })
  document.addEventListener('mouseout', (e: MouseEvent) => {
    if (activeElement.has(e.target as HTMLElement)) return // 如果移出按钮则返回
    const target = e.target as HTMLElement
    resetBorderStyle(target)
  })
})

async function handleClick(task: string, selectedElements: HTMLElement[]) {
  isLoading.value = true
  await executeTask(task, selectedElements)
  isLoading.value = false
}

const isLoading = ref(false)

const routes = [
  {
    url: '/experiments/experiment1',
    name: '实验一：为登录按钮添加登录逻辑'
  },
  {
    url: '/experiments/experiment2',
    name: 'page2'
  },
  {
    url: '/experiments/experiment3',
    name: 'page3'
  }
]
</script>

<template>
  <div id="choice">
    <a v-for="route in routes" :key="route.url" :href="route.url" class="choice__item">{{
      route.name
    }}</a>
  </div>
  <div id="main__container">
    <div
      class="search-bar"
      v-show="inputValue.show"
      :style="{ left: inputValue.left, top: inputValue.top }"
    >
      <PromptInput
        textarea-default-prompt="Your command here."
        :loading="isLoading"
        v-model="task"
        @submit="handleClick(task, selectedElements)"
      ></PromptInput>
    </div>

    <NuxtPage />
  </div>
</template>

<style scoped lang="scss">
#choice {
  width: 100vw;
  height: 5%;
  display: flex;

  .choice__item {
    flex-grow: 1;
    display: inline-block;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    background-color: #f5f5f5;
    color: #333;
  }
}
#main__container {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .search-bar {
    position: fixed;
    top: 10px;
    left: 10px;
    width: 400px;
    z-index: 9999;
  }
}
</style>
