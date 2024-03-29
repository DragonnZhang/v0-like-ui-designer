// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt'],
  devtools: { enabled: true },
  runtimeConfig: {
    openaiApiKey: '',
    qwenApiKey: '',
    baiduApiKey: '',
    baiduSecretKey: '',
    googleApiKey: '',
    model: 'gemini', // Available choices: openai、qwen、wenxin and gemini
    temperature: 1,
    maxTokens: 2048,
    public: {
      streaming: true // Generate html page in streaming or direct mode
    }
  },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  }
})
