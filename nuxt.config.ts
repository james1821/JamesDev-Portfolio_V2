export default defineNuxtConfig({
  compatibilityDate: '2026-05-02',
  devtools: { enabled: true },
  devServer: { host: '0.0.0.0', port: 3000 },

  modules: ['@nuxtjs/tailwindcss', '@nuxt/image'],
  components: [{ path: '~/components', pathPrefix: false }],
  css: ['~/assets/css/main.css'],

  future: { compatibilityVersion: 4 },
  experimental: { payloadExtraction: true },

  routeRules: {
    // Public pages are prerendered at build time and revalidated hourly by the
    // content API's own cache, so visitors never wait on Firestore.
    '/': { isr: 3600 },
    '/experience': { isr: 3600 },
    '/projects': { isr: 3600 },
    '/stack': { isr: 3600 },
    '/certifications': { isr: 3600 },
    // The dashboard is client-only: it keeps the Firebase web SDK out of the
    // server bundle and out of every public page's payload.
    '/admin/**': { ssr: false, robots: false },
    '/api/content': { cache: { maxAge: 300, swr: true } },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#0F1115' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap',
        },
      ],
    },
    pageTransition: { name: 'route-fade', mode: 'out-in' },
  },

  image: {
    quality: 76,
    format: ['webp', 'jpg'],
    screens: { xs: 360, sm: 640, md: 768, lg: 1024, xl: 1280 },
    domains: ['firebasestorage.googleapis.com', 'i.ibb.co', 'cdn.jsdelivr.net', 'media.licdn.com'],
  },

  typescript: { strict: true, typeCheck: false },

  nitro: {
    compressPublicAssets: { gzip: true, brotli: true },
    // A remote image host being briefly unreachable should not fail a deploy;
    // ISR regenerates these pages on first request anyway.
    prerender: { crawlLinks: false, routes: [], failOnError: false },
  },

  runtimeConfig: {
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID || '',
    firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
    firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY || '',
    firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
    openrouterApiKey: process.env.OPENROUTER_API_KEY || '',
    openrouterModel: process.env.OPENROUTER_MODEL || '',
    assistantQuestionLimit: process.env.ASSISTANT_QUESTION_LIMIT || '5',
    siteUrl: process.env.SITE_URL || 'http://localhost:3000',

    public: {
      siteUrl: process.env.SITE_URL || 'http://localhost:3000',
      firebase: {
        apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY || '',
        authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
        projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID || '',
        storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
        messagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
        appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID || '',
      },
    },
  },
})
