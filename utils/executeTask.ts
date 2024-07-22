import { addId } from './util'

async function changeElementStyleV2(task: string, selectedElements: HTMLElement[]) {
  selectedElements.forEach((selectedElement) => {
    addId(selectedElement)
  })
  const cloned = selectedElements.map((selectedElement) => {
    return selectedElement.cloneNode(true)
  }) as HTMLElement[]
  cloned.forEach((v) => {
    removeClass(v)
    removeSvg(v)
  })
  console.log(cloned)

  let domString = ''
  cloned.forEach((c) => {
    domString += c.outerHTML
  })

  console.log(`html: ${domString}`)

  let code = (
    await useFetch('/api/generateLogicCode', {
      method: 'POST',
      body: {
        domString,
        task
      }
    })
  ).data.value as string

  function extractHandler(c: string) {
    if (c.includes('DOMContentLoaded')) {
      const regex =
        /document\.addEventListener\((?:'|")DOMContentLoaded(?:'|"),\s*function\(\)\s*\{\s*(.*)\}\);/

      c = c.split('\n').join('')
      console.log(c)
      return regex.exec(c)![1]
    }
    return c
  }

  code = extractHandler(code)

  console.log(`code: ${code}`)

  eval(code)
}

function removeClass(element: HTMLElement) {
  function dfs(element: HTMLElement) {
    element.removeAttribute('class')

    for (let child of element.children) {
      dfs(child as HTMLElement)
    }
  }

  dfs(element)
}

function removeSvg(element: HTMLElement) {
  function dfs(element: HTMLElement) {
    if (element.tagName === 'svg') {
      element.remove()
    }

    for (let child of element.children) {
      dfs(child as HTMLElement)
    }
  }

  dfs(element)
}

const styleObject = reactive({
  'font-size': '0',
  color: ''
})

let stopHandler = () => {}

const windowShowValue = ref(false)

// task3: show a window to let user change style
function showWindow(selectedElements: HTMLElement[]) {
  // initialize styleObject value and watchEffect
  const el = selectedElements[0]

  const style = window.getComputedStyle(el)

  for (const key in styleObject) {
    styleObject[key as keyof typeof styleObject] = style.getPropertyValue(key)
  }

  stopHandler = watchEffect(() => {
    for (const key in styleObject) {
      el.style[key as any] = styleObject[key as keyof typeof styleObject]
    }
  })

  // show window
  windowShowValue.value = true
}

function cleanWindow() {
  stopHandler()
  windowShowValue.value = false
}

// main function to classify tasks and call handlers to execute them
async function executeTask(task: string, selectedElements: HTMLElement[]) {
  const type = 0

  console.log(`任务类型:${type === 0 ? '改变样式' : '使用属性窗格改变样式'}`)
  if (type === 0) {
    changeElementStyleV2(task, selectedElements)
  } else {
    showWindow(selectedElements)
  }
}

export { executeTask, cleanWindow, styleObject, windowShowValue }
