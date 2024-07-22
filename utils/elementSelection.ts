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
  selectedElements.value.push(el)
  inputValue.show = true
  inputValue.top = el.offsetTop + el.clientHeight + 'px'
  inputValue.left = el.offsetLeft + el.clientWidth + 'px'
}

const clearInfo = () => {
  inputValue.show = false
  selectedElements.value = []
}

export { inputValue, processSelection, selectedElements, processClick, clearInfo }
