const querystring = require('querystring')

export const strict = false

export const state = () => ({
  orgError: '',
  orgs: [],
  recentUsageByCheckpoint: []
})

export const getters = {
  interval: (state) => state.interval,
  orgError: (state) => state.orgError,
  orgs: (state) => state.orgs,
  recentUsageByCheckpoint: (state) => state.recentUsageByCheckpoint
}

export const mutations = {
  setInterval(state, interval) {
    state.interval = interval
  },
  setOrgError(state, error) {
    state.orgError = error
  },
  setOrgs(state, orgs) {
    state.orgs = orgs
  },
  setRecentUsageByCheckpoint(state, usage) {
    state.recentUsageByCheckpoint = usage
  }
}

export const actions = {
  async deleteOrg({ commit }, id) {
    commit('setFetching', true, { root: true })

    try {
      await this.$axios.delete(`/organizations/${id}`)
      commit('setSnackbarText', `Deleted organization.`, { root: true })
    } catch (e) {
      console.error('Failed to load organizations.')
      commit('setSnackbarText', `Failed to delete organization.`, { root: true })
    }

    commit('setFetching', false, { root: true })
  },

  async getOrgs({ commit }) {
    commit('setFetching', true, { root: true })

    try {
      const { data } = await this.$axios.get(`/organizations`)
      commit('setOrgs', data)
    } catch (e) {
      console.error('Failed to load organizations.')
    }

    commit('setFetching', false, { root: true })
  },

  async saveOrg({ commit }, org) {
    commit('setFetching', true, { root: true })
    let updated

    try {
      const { data } = org.id ? await this.$axios.put(`/organizations/${org.id}`, org) : await this.$axios.post(`/organizations`, org)

      updated = data

      await this.$axios.post(`/organizations/${updated.id}/provision`, {})

      commit('setSnackbarText', `Organization ${org.name} updated.`, { root: true })
    } catch (e) {
      console.error('Failed to create/update organization.')
      commit('setSnackbarText', `Failed to update organization ${org.name}.`, { root: true })
    }

    commit('setFetching', false, { root: true })
    return updated
  },

  async getRecentUsageByCheckpoint({ commit }, { start, end, org }) {
    start = start ? start.toISOString() : ''
    end = end ? end.toISOString() : ''
    const orgId = org ? org.id : null
    const query = querystring.stringify({ start, end, orgId })
    const { data: metrics } = await this.$axios.get(`/metrics?${query}`)
    const {
      totalInvitations,
      totalRegistrations,
      totalUsersWithAtLeastOneCredentialAccepted,
      totalUsersWithAtLeastOneVerificationApproved
    } = metrics

    function pct(numerator, denominator) {
      return `${numerator.toLocaleString()} people | ${((numerator * 100) / Math.max(1, denominator)).toFixed(0)}%`
    }

    commit('setRecentUsageByCheckpoint', [
      ['', '', { role: 'style' }, { role: 'annotation' }],
      ['Invited', totalInvitations, '#b87333', `${totalInvitations.toLocaleString()} people`],
      ['Registered', totalRegistrations, 'purple', pct(totalRegistrations, totalInvitations)],
      [
        'Accepted a Credential',
        totalUsersWithAtLeastOneCredentialAccepted,
        'green',
        pct(totalUsersWithAtLeastOneCredentialAccepted, totalRegistrations)
      ],
      [
        'Approved a Verification',
        totalUsersWithAtLeastOneVerificationApproved,
        'blue',
        pct(totalUsersWithAtLeastOneVerificationApproved, totalUsersWithAtLeastOneCredentialAccepted)
      ]
    ])
  }
}
