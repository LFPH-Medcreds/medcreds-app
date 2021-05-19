const colors = require('vuetify/es5/util/colors').default
require('dotenv').config({ path: '.env' })

module.exports = {
  telemetry: false,
  server: {
    port: 3000,
    host: '0.0.0.0',
  },

  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:site', content: '@myproofmarket' },
      { property: 'og:site_name', content: 'ProofMarket' },
      { property: 'og:description', content: process.env.npm_package_description },
      { property: 'og:image', content: 'https://app.medcreds.com/proofmarket.svg' },
      { property: 'og:url', content: 'https://app.medcreds.com' },
      { property: 'og:type', content: 'business' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [{ src: `https://polyfill.io/v3/polyfill.js?features=es5,es6,es7&flags=gated`, body: true }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: false, //,{ color: '#6dacea' },
  /*
   ** Global CSS
   */
  css: ['@/assets/global.styl'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/axios',
    '@/plugins/qrcode',
    '@/plugins/prism',
    '@/plugins/filters',
    '@/plugins/v-calendar',
    '@/plugins/sse',
    '@/plugins/dialog',
    '@/plugins/search',
    {
      src: '~/plugins/vidle.js'
    },
    {
      src: '~/plugins/datetimepicker.js'
    },
    {
      src: '~/plugins/ant-design-vue.js',
      mode: 'client'
    },
    {
      src: '~/plugins/ie11.js'
    },
    {
      src: '~/plugins/google-charts.js'
    },
    {
      src: '~/plugins/dialog.js'
    },
    {
      src: '~/plugins/search.js'
    }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxtjs/vuetify'],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/pwa',
    '@nuxtjs/axios',
    '@nuxtjs/dotenv',
    '@nuxtjs/proxy',
  ],
  env: {
    zoomUserId: process.env.ZOOM_USER_ID
  },
  proxy: {
    '/api/': { target: process.env.API_URL || 'http://localhost:5000', pathRewrite: {'^/api/': ''} }
  },
  axios: {
    baseURL: process.env.API_URL ? process.env.API_URL : '/api',
    credentials: true,
    init(axios) {
      axios.defaults.withCredentials = true
    },
    retry: {
      retries: 3
    },
    debug: true,
    headers: {
      Accept: 'application/json, text/plain, */*'
    }
  },
  vue: {
    config: {
      productionTip: process.env.PRODUCTION === 'true',
      devtools: process.env.PRODUCTION !== 'true'
    }
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      light: true,
      themes: {
        light: {
          primary: '#005c9e',
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map'
      }
      config.module.rules.push({
        test: /\.(_redirects?g)$/i,
        loader: 'file-loader',
        options: {
          name: '[name]'
        }
      })
    }
  },
  router: {
    middleware: 'role-guard'
  }
}
