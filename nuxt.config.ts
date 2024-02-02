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
    // Available choices: openai、qwen、wenxin and gemini
    model: 'gemini',
    temperature: 1,
    maxTokens: 2048,
    public: {
      // Generate html page in streaming or direct mode
      streaming: true
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
