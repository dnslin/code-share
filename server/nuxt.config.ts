// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },

  nitro: {
    experimental: {
      openAPI: true,
    },
  },

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || "Node-Code-Server",
    dbPath: process.env.DATABASE_PATH || "database.db",
  },

  ssr: false,
  modules: [],
  app: {
    head: {},
  },
  pages: false,
  components: false,

  typescript: {
    typeCheck: false,
    strict: true,
  },

  compatibilityDate: "2024-11-10",
});
