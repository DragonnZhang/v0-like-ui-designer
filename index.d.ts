import type { modelType } from './utils/type'

declare module 'nuxt/schema' {
  interface RuntimeConfig {
    openaiApiKey: string
    qwenApiKey: string
    baiduApiKey: string
    baiduSecretKey: string
    streaming: boolean
    model: modelType
  }
}
// It is always important to ensure you import/export something when augmenting a type
export {}
