const config = useRuntimeConfig()

const s = `
# Routes

## Web Page Routing

- /: ${config.backendUrl}
  - index page
  - experiments
    - experiment1
      - index page
      - welcome page
    - experiment2
    - experiment3
`

export default s
