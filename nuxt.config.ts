// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    openaiApiKey: '',
    qwenApiKey: '',
    baiduApiKey: '',
    baiduSecretKey: '',
    streaming: true,
    model: 'qwen'
  },
  css: ['~/assets/css/main.scss'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  }
})
