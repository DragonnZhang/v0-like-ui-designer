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
    model: 'gemini', // Available choices: openai、qwen、baidu and gemini（百度千帆用不了，效果也不行，别用了；qwen 效果也很差）
    temperature: 0,
    maxTokens: 0, // 0 means returns as many tokens as possible given the prompt and the model's maximum context size
    backendUrl: '',
    public: {
      streaming: false // Generate html page in streaming or direct mode
    }
  },

  css: ['~/assets/css/main.css'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },

  compatibilityDate: '2024-07-22'
})
