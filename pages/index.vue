<script setup lang="ts">
import { ref } from 'vue'
import { inputValue, processClick, clearInfo, selectedElements } from '~/utils/elementSelection'
import { executeTask } from '~/utils/executeTask'
import PageTemplate from '~/components/MainPage/PageTemplate.vue'
import PromptInput from '~/components/MainPage/PromptInput.vue'

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

const styleMap = new Map<HTMLElement, CSSStyleDeclaration>()

onMounted(() => {
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.code === multipleChoiceKey) {
      multipleChoiceMode = true
    }
    if (e.code === exitKey) {
      clearInfo()
      activeElement.forEach((el) => {
        resetStyle(el)
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
    if (el.id === 'app') return

    const style = JSON.parse(JSON.stringify(el.style))
    styleMap.set(el, style)
    el.style.border = '1px dashed red'
  })
  document.addEventListener('mouseout', (e: MouseEvent) => {
    if (activeElement.has(e.target as HTMLElement)) return // 如果移出按钮则返回
    const target = e.target as HTMLElement
    resetStyle(target)
  })
})

function resetStyle(target: HTMLElement) {
  const style = styleMap.get(target)

  if (!style) {
    target.style.border = 'none'
    return
  }

  // 样式重新赋值
  target.style.borderBottomColor = style.borderBottomColor
  target.style.borderBottomStyle = style.borderBottomStyle
  target.style.borderBottomWidth = style.borderBottomWidth

  target.style.borderRightColor = style.borderRightColor
  target.style.borderRightStyle = style.borderRightStyle
  target.style.borderRightWidth = style.borderRightWidth

  target.style.borderTopColor = style.borderTopColor
  target.style.borderTopStyle = style.borderTopStyle
  target.style.borderTopWidth = style.borderTopWidth

  target.style.borderLeftColor = style.borderLeftColor
  target.style.borderLeftStyle = style.borderLeftStyle
  target.style.borderLeftWidth = style.borderLeftWidth
}

async function handleClick(task: string, selectedElements: HTMLElement[]) {
  isLoading.value = true
  await executeTask(task, selectedElements)
  isLoading.value = false
}

const isLoading = ref(false)
</script>

<template>
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

  <PageTemplate />
</template>

<style scoped lang="scss">
.search-bar {
  position: fixed;
  top: 10px;
  left: 10px;
  width: 450px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  box-sizing: content-box;
}
</style>
