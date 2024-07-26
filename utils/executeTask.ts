import { addId, type JSONData } from './util'

// dom 元素预处理
function elementPreprocessing(selectedElements: HTMLElement[]) {
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

  selectedElements.forEach((selectedElement) => {
    addId(selectedElement)
  })
  const cloned = selectedElements.map((selectedElement) => {
    return selectedElement.cloneNode(true)
  }) as HTMLElement[]
  cloned.forEach((v) => {
    // removeClass(v)
    removeSvg(v)
  })
  console.log(cloned)

  let domString = ''
  cloned.forEach((c) => {
    domString += c.outerHTML
  })

  console.log(`html:\n${domString}`)

  return domString
}

// 返回值是一个 json 字符串
async function getLLMProcessingResult(task: string, domString: string): Promise<string> {
  let result = (
    await useFetch('/api/generateLogicCode', {
      method: 'POST',
      body: {
        domString,
        task
      }
    })
  ).data.value as string

  console.log(`LLM response result:\n${result}`)

  return result
}

// 处理 json 字符串
function handleJsonString(jsonString: string) {
  // 去除 \n，否则 JSON.parse 会报错
  const jsonObject = JSON.parse(jsonString.replaceAll('\n', '')) as {
    data: JSONData
  }

  console.log('jsonObject:')
  console.log(jsonObject)

  return { ...jsonObject.data }
}

// 执行代码
function executeCode(data: JSONData) {
  // 这里不做解构，因为担心 eval 的变量名和解构变量名冲突
  console.log(`target:\n${data.target}`)
  console.log(`parameters:\n${data.parameters}`)
  console.log(`returnValue:\n${data.returnValue}`)
  console.log(`code:\n${data.code}`)

  let targetCode = ''
  // 执行 target 代码，获得 target 变量，存储在 window 中
  if (data.target) {
    targetCode = `let target = ${data.target}\n`
  }

  // 处理 parameters
  if (data.parameters) {
    data.parameters = data.parameters.map((v) => {
      if (['target', 'targets'].includes(v)) {
        return 'target'
      }
      if (typeof v === 'string') {
        return `'${v}'`
      }
      return v
    })
  }

  // 执行 code 代码中的 f 函数并传参
  if (data.code) {
    const code = targetCode + data.code + `\nf(${data.parameters.join(',')})`
    console.log(`Eval code:\n${code}`)
    eval(code)
  }
}

// main function
async function executeTask(task: string, selectedElements: HTMLElement[]) {
  const domString = elementPreprocessing(selectedElements)
  const jsonString = await getLLMProcessingResult(task, domString)
  const data = handleJsonString(jsonString)
  executeCode(data)
}

export { executeTask }
