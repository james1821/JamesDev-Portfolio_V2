
export default defineNuxtConfig({
  compatibilityDate: '2026-05-02',
  devtools: { enabled: true },
devServer: {
    host: '0.0.0.0',   
    port: 3000,
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
  ],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Mark James Espinosa — Full-Stack Web Developer',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Portfolio of Mark James Espinosa — Full-Stack Web Developer specializing in Nuxt, Vue, and modern web technologies.' },
        { property: 'og:title', content: 'Mark James Espinosa — Full-Stack Web Developer' },
        { property: 'og:description', content: 'Portfolio of Mark James Espinosa — Full-Stack Web Developer specializing in Nuxt, Vue, and modern web technologies.' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: ''
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600;700;800&display=swap'
        }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  image: {
    quality: 80,
    format: ['webp', 'jpg'],
  },

  typescript: {
    strict: true
  }
})
