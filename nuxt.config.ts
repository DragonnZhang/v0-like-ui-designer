// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt'],
  devtools: { enabled: true },
  runtimeConfig: {
    openaiApiKey: '',
    qwenApiKey: '',
    baiduApiKey: '',
    baiduSecretKey: '',
    model: 'openai',
    public: {
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
