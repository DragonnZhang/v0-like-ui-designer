let id = 0

function addId(dom: HTMLElement) {
  function traverse(el: HTMLElement) {
    el.id = `id${id++}`
    for (const child of el.children) {
      if (child.nodeType === 1) {
        traverse(child as HTMLElement)
      }
    }
  }

  traverse(dom)
}

type JSONData = {
  target: string
  parameters: string[]
  returnValue: string[]
  code: string
}

export { addId, type JSONData }
