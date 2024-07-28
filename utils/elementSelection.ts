// search input
const inputValue = reactive({
  show: false,
  top: '0px',
  left: '0px'
})

// selected elements
let selectedElements = ref<HTMLElement[]>([])

// main logic
const processSelection = (event: Event) => {
  const selection = window.getSelection()

  // start and end are the same, just return
  if (!selection || selection.isCollapsed) {
    // inputValue.show = false
    return
  }

  // get the range object, so that I can know the nodes selected
  const range = selection.getRangeAt(0)

  // get the all the nodes in range
  const container = range.commonAncestorContainer
  const nodes: Node[] = [] // store all the nodes
  // a simple dfs
  const traverse = (node: Node) => {
    if (selection.containsNode(node)) {
      nodes.push(node)
    }
    for (const child of node.childNodes) {
      traverse(child)
    }
  }
  traverse(container)

  // change from nodes to elements
  const elements: Set<HTMLElement> = new Set()
  nodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      elements.add(node as HTMLElement)
    } else {
      while (node.nodeType !== Node.ELEMENT_NODE) {
        node = node.parentElement!
      }
      elements.add(node as HTMLElement)
    }
  })
  selectedElements.value = Array.from(elements)

  // get last element' s position
  // and set search bar' s position
  const lastElement = selectedElements.value[selectedElements.value.length - 1]
  inputValue.show = true
  inputValue.top = lastElement.offsetTop + lastElement.clientHeight + 'px'
  inputValue.left = lastElement.offsetLeft + lastElement.clientWidth + 'px'
}

const processClick = (el: HTMLElement) => {
  if (selectedElements.value.includes(el)) {
    // 多选元素重复点击，则删除该元素
    selectedElements.value = selectedElements.value.filter((item) => item !== el)
    inputValue.show = selectedElements.value.length > 0
    resetBorderStyle(el)
    return
  }
  selectedElements.value.push(el)
  inputValue.show = true
  inputValue.top = el.offsetTop + el.clientHeight + 'px'
  inputValue.left = el.offsetLeft + el.clientWidth + 'px'
  addBorderStyle(el, false)
}

const clearInfo = () => {
  inputValue.show = false
  selectedElements.value = []
}

const styleMap = new Map<HTMLElement, CSSStyleDeclaration>()

const addBorderStyle = (el: HTMLElement, rememberStyle = true) => {
  if (rememberStyle) {
    const style = JSON.parse(JSON.stringify(el.style))
    styleMap.set(el, style)
  }
  el.style.border = '1px dashed red'
}

const resetBorderStyle = (target: HTMLElement) => {
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

export {
  inputValue,
  processSelection,
  selectedElements,
  processClick,
  clearInfo,
  addBorderStyle,
  resetBorderStyle
}
