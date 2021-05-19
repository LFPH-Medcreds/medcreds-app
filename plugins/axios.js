import https from 'https'

export default function ({ $axios, redirect, app }) {
  $axios.defaults.httpsAgent = new https.Agent({ rejectUnauthorized: false })
  $axios.onRequest((config) => {
    console.log('Making request to ' + config.url)
  })

  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status)
    // if (code === 401) {
    //   redirect('/')
    // }
    // if (code === 400) {
    //   redirect('/400')
    // }
  })

  $axios.traceId = Math.random().toString().substring(2)
  $axios.traceRN = 0

  console.info('App Version: 2.0.4 (Intercom component)')
  console.info('X-TraceID', $axios.traceId)

  $axios.interceptors.request.use(
    (config) => {
      config.withCredentials = true

      config.headers['X-TraceId'] = $axios.traceId + '.' + $axios.traceRN
      $axios.traceRN++

      return config
    },
    (error) => {
      console.error($axios.traceId, 'request failed')
      return Promise.reject(error)
    }
  )
}
