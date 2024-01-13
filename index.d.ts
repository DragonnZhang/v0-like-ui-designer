declare module 'nuxt/schema' {
  interface RuntimeConfig {
    openaiApiKey: string
    qwenApiKey: string
    baiduApiKey: string
    baiduSecretKey: string
    streaming: boolean
    model: string
  }
}
// It is always important to ensure you import/export something when augmenting a type
export {}
