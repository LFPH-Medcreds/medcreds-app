export default {
  computed: {
    showCredentials: {
      get() {
        return this.$store.state.wallet.showCredentials
      },
      set(val) {
        this.$store.commit('wallet/showCredentials', val)
      }
    },
    showRequests: {
      get() {
        return this.$store.state.wallet.showRequests
      },
      set(val) {
        this.$store.commit('wallet/showRequests', val)
      }
    },
    showConsents: {
      get() {
        return this.$store.state.wallet.showConsents
      },
      set(val) {
        this.$store.commit('wallet/showConsents', val)
      }
    },
    showConnections: {
      get() {
        return this.$store.state.wallet.showConnections
      },
      set(val) {
        this.$store.commit('wallet/showConnections', val)
      }
    }
  }
}
