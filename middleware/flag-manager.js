export default function ({ store, route }) {
  const { intercom } = route.query

  if (intercom === '0') {
    console.log('[FLAGS] Intercom has been explicitly disabled.')
    localStorage.disableIntercom = 'true'
  } else if (intercom === '1') {
    console.log('[FLAGS] Intercom has been explicitly enabled.')
    localStorage.disableIntercom = null
  }

  if (intercom !== undefined) {
    const query = { ...route.query }
    delete query.intercom

    console.log(route)
    store.app.router.push({ query })
  }
}
