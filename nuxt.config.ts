import TW from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  telemetry: { enabled: false },

  modules: ['@nuxt/eslint', '@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt'],

  // Base config
  pages: true,
  ssr: import.meta.env.NUXT_SSR === 'true',
  css: ['@/assets/css/tw.t.css'],
  vite: { plugins: [TW()] },
  runtimeConfig: {
    appName: process.env.API_NAME,
    appEmail: process.env.API_MAIL,
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  // Pinia conf
  piniaPluginPersistedstate: {
    // key: 'yurin-%id-store',
    storage: 'sessionStorage',
  },

  // any
  typescript: {},
  eslint: {},

  // server
  devServer: {
    port: Number(process.env.PORT) || 3000,
  },
})
