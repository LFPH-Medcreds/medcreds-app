import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      isDoctor: 'users/isDoctor',
      isVerifier: 'users/isVerifier',
      isPatient: 'users/isPatient',
      isAdmin: 'users/isAdmin',
      isRoot: 'users/isRoot',
      fetching: 'fetching',
      user: 'users/user'
    }),
    organizations() {
      return this.user && this.user.organizations
    },
    adminOrganizations() {
      const { organizations } = this
      return (
        organizations &&
        organizations.filter((org) => {
          return org.userRoles.roles.includes('admin')
        })
      )
    },
    selectedOrg: {
      get() {
        return this.$store.state.users.selectedOrg
      },
      set(org) {
        this.$store.commit('users/setSelectedOrg', org)
      }
    },
    hostOrgId() {
      const org = this.selectedOrg || (this.user && this.user.rootOrg)
      return org && org.id
    },
    hostOrgName() {
      const org = this.selectedOrg || (this.user && this.user.rootOrg)
      return org && org.name
    }
  },
  watch: {
    organizations(organizations) {
      if (!organizations) return
      if (this.selectedOrg) {
        const org = organizations.find((org) => org.id === this.selectedOrg.id)
        this.selectedOrg = org
      }
      if (!this.selectedOrg && organizations.length) {
        const selectedOrgId = localStorage.getItem('selectedOrgId')
        if (selectedOrgId) {
          const org = organizations.find((org) => org.id == selectedOrgId)
          if (org) this.selectedOrg = org
          else this.selectedOrg = organizations[0]
        } else this.selectedOrg = organizations[0]
      }
    },

    selectedOrg(selectedOrg, oldSelectedOrg) {
      if (!selectedOrg || (selectedOrg && !selectedOrg.userRoles)) return
      if (oldSelectedOrg && oldSelectedOrg.id === selectedOrg.id) return
      if (!selectedOrg.userRoles.roles) return

      localStorage.setItem('selectedOrgId', selectedOrg.id)

      if (this.$fetch) this.$fetch()

      if (!window.history.length) {
        this.$router.push('/wallet')
      }
    }
  }
}
