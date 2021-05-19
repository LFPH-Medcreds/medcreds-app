const verify = (path, routes) => {
  const match = routes.filter((route) => path.toLowerCase().includes(route))
  return match.length > 0
}

const getRoles = () => {
  const roles = localStorage.getItem('userRoles')
  return roles ? JSON.parse(roles) : {}
}

export default function ({ store, route }) {
  const rootRoutes = ['/root']
  const verifierRoutes = ['/verifier']
  const doctorRoutes = ['/doctor']
  const adminRoutes = ['/org']
  const { isAdmin, isDoctor, isRoot, isVerifier } = getRoles()
  let shouldRedirect = false
  if (verify(route.fullPath, rootRoutes) && !isRoot) {
    shouldRedirect = true
  }
  if (verify(route.fullPath, verifierRoutes) && !isVerifier) {
    shouldRedirect = true
  }
  if (verify(route.fullPath, doctorRoutes) && !isDoctor) {
    shouldRedirect = true
  }
  if (verify(route.fullPath, adminRoutes) && !isAdmin) {
    shouldRedirect = true
  }
  if (shouldRedirect) {
    store.app.router.replace('/wallet')
  }
}
