let id = 0

export function addId(dom: HTMLElement) {
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
