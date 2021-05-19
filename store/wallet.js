export const strict = false

export const state = () => ({
  showCredentials: true,
  showRequests: true,
  showConsents: true,
  showConnections: true
})

export const getters = {
  showCredentials: (state) => state.showCredentials,
  showRequests: (state) => state.showRequests,
  showConsents: (state) => state.showConsents,
  showConnections: (state) => state.showConnections
}

export const mutations = {
  showCredentials(state, val) {
    state.showCredentials = val
  },
  showRequests(state, val) {
    state.showRequests = val
  },
  showConsents(state, val) {
    state.showConsents = val
  },
  showConnections(state, val) {
    state.showConnections = val
  }
}

export const actions = {}
