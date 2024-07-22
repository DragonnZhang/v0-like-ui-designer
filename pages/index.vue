<script setup lang="ts">
import { ref } from 'vue'
import { inputValue, processClick, clearInfo, selectedElements } from '~/utils/elementSelection'
import { executeTask, cleanWindow, styleObject, windowShowValue } from '~/utils/executeTask'
import PageTemplate from '~/components/MainPage/PageTemplate.vue'

const task = ref<string>('')

const history = ref<string[]>([])

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
      cleanWindow()
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
    ;(e.target as HTMLElement).style.border = 'none'
  })
})

function handleClick(task: string, selectedElements: HTMLElement[]) {
  history.value.push(task)
  executeTask(task, selectedElements)
}
</script>

<template>
  <!-- search and execute -->
  <div
    class="search-bar"
    v-show="inputValue.show"
    :style="{ left: inputValue.left, top: inputValue.top }"
  >
    <div class="upper-area">
      <input type="text" v-model="task" placeholder="Your command here." />
      <button @click="handleClick(task, selectedElements)">CONFIRM</button>
    </div>
    <!-- here we have style manipulation panel -->
    <div class="style-panel" v-if="windowShowValue">
      <input type="text" v-model="styleObject['font-size']" />
      <input type="text" v-model="styleObject['color']" />
    </div>
  </div>

  <PageTemplate />
</template>

<style scoped lang="scss">
.top {
  position: fixed;
  top: 0;
  right: 0;
  height: 30px;
  text-align: right;

  .saved {
    text-align: center;

    div {
      cursor: pointer;
    }
  }
}
.save-button {
  background-color: #58be6a;
  color: black;
  border-radius: 5px;
  height: 100%;
  position: relative;
}
.search-bar {
  position: fixed;
  top: 10px;
  left: 10px;
  height: 32px;
  width: 600px;

  .upper-area {
    display: flex;
    justify-content: center;
    height: 100%;
  }

  .history {
    text-align: start;
  }

  input {
    user-select: all;
    width: 100%;
    padding-left: 5px;
  }

  button {
    background-color: white;
    color: black;
    width: 150px;
  }
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

button {
  border-radius: 0 8px 8px 0;
  border: 1px solid transparent;
  font-size: 16px;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}
</style>
