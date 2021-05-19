import { DateTime, Interval } from 'luxon'

export const strict = false

export const state = () => ({
  credentials: [],
  verification: null,
  verifyId: null,
  verifyPolicy: null,
  useVerifyId: false,
  credentialDefinitions: [],
  verificationDefs: [],
  verificationPolicies: [],
  proposedVerificationRequest: null,
  verificationResult: null
})

export const getters = {
  credentials: (state) => state.credentials,
  credentialDefinitions: (state) => state.credentialDefinitions,
  verificationDefs: (state) => state.verificationDefs,
  verificationPolicies: (state) => state.verificationPolicies,
  verification: (state) => state.verification,
  verifyId: (state) => state.verifyId,
  verifyPolicy: (state) => state.verifyPolicy,
  useVerifyId: (state) => state.useVerifyId,
  proposedVerificationRequest: (state) => state.proposedVerificationRequest,
  verificationResult: (state) => state.verificationResult
}

export const mutations = {
  setCredentials(state, credentials) {
    state.credentials = credentials
  },
  setCredentialDefinitions(state, defs) {
    state.credentialDefinitions = defs
  },
  cacheVerifyId(state, verifyId) {
    state.verifyId = verifyId
  },
  setUseVerifyId(state, useIt) {
    state.useVerifyId = useIt
  },
  setVerifyPolicy(state, policy) {
    state.verifyPolicy = policy
  },
  setVerificationPolicies(state, verificationPolicies) {
    state.verificationPolicies = verificationPolicies
  },
  setVerification(state, verificationResult) {
    state.verificationResult = verificationResult
  },
  setProposedVerificationRequest(state, proposedVerificationRequest) {
    state.proposedVerificationRequest = proposedVerificationRequest
  },
  clearProposedVerificationRequest(state) {
    state.proposedVerificationRequest = null
  }
}

export const actions = {
  async getCredentialDefinitions({ commit }, { hostOrgId }) {
    const { data: credentialDefinitions } = await this.$axios.get(`/credentials/definitions/${hostOrgId}`)
    commit('setCredentialDefinitions', credentialDefinitions)
  },

  async getCredentials({ commit }, { hostOrgId, connectionId }) {
    if (!connectionId) {
      const { data } = await this.$axios.get(`/credentials/${hostOrgId}`)
      commit('setCredentials', data)
      return data
    } else {
      const { data } = await this.$axios.get(`/credentials/${hostOrgId}?connectionId=${connectionId}`)
      commit('setCredentials', data)
      return data
    }
  },

  async deleteCredential({ commit }, { hostOrgId, credentialId }) {
    if (!credentialId) {
      return
    } else {
      const { data } = await this.$axios.delete(`/credentials/${hostOrgId}?credentialId=${credentialId}`)
      // commit('setCredentials', data)
      return data
    }
  },

  async offerCredential({ commit, dispatch }, { test, hostOrgId }) {
    commit('setFetching', true, { root: true })
    const { connectionId, credential, patientId, id: testId } = test

    try {
      await this.$axios.post('/credentials', {
        patientId,
        testId,
        connectionId,
        hostOrgId,
        credentialValues: credential
      })
      commit('setSnackbarText', 'Test Successfully Certified', { root: true })

      await dispatch('users/getTests', hostOrgId, { root: true })
      commit('users/togglePatientModal', null, { root: true })
    } catch (e) {
      console.error(`error while certifying test for patient '${patientId}' for organization '${hostOrgId}'.`)
      commit('setSnackbarText', 'Operation Failed. Please Try Again Later', { root: true })
    }

    commit('setFetching', false, { root: true })
  },

  async issueTempCred({ commit, dispatch }, { hostOrgId, patientEmail, temp, tempUnits }) {
    commit('setFetching', true, { root: true })

    try {
      await this.$axios.post('/credentials/temp', { hostOrgId, patientEmail, temp, tempUnits })

      commit('setSnackbarText', 'Temperature Successfully Certified', { root: true })
      await dispatch('users/getWallet', null, { root: true })
    } catch (e) {
      console.error(`error while certifying temperature for patient '${patientEmail}' for organization '${hostOrgId}'.`)
      commit('setSnackbarText', 'Operation Failed. Please Try Again Later', { root: true })
    }

    commit('setFetching', false, { root: true })
  },

  async issueSelfCheckCred({ commit, dispatch }, { hostOrgId, patientEmail, closeProximity, newSymptoms, emergencySymptoms, testAdvised }) {
    commit('setFetching', true, { root: true })

    try {
      await this.$axios.post('/credentials/selfcheck', {
        hostOrgId,
        patientEmail,
        closeProximity,
        newSymptoms,
        emergencySymptoms,
        testAdvised
      })

      commit('setSnackbarText', 'Self Check Successfully Certified', { root: true })
      await dispatch('users/getWallet', null, { root: true })
    } catch (e) {
      console.error(`error while certifying self-check for patient '${patientEmail}' for organization '${hostOrgId}'.`)
      commit('setSnackbarText', 'Operation Failed. Please Try Again Later', { root: true })
    }

    commit('setFetching', false, { root: true })
  },

  async sendVerification({ commit, dispatch }, { to, verifyId, channel, moreToCome }) {
    commit('setFetching', true, { root: true })
    try {
      await this.$axios.post(`/verify/${verifyId}/send`, { to, channel })
      commit('setSnackbarText', `Verification Request sent to ${to}`, { root: true })
    } catch (e) {
      console.error(`error while sending verification request to '${to}' on channel '${channel}'.`)
      commit('setSnackbarText', `Verification Request failed for ${to}`, { root: true })
    }

    await dispatch('users/getWallet', null, { root: true })
    if (!moreToCome) {
      commit('users/toggleSendVerificationModal', null, { root: true })
    }

    commit('setFetching', false, { root: true })
  },

  async startVerification({ commit }, { policyId, policyName, hostOrgId }) {
    commit('setFetching', true, { root: true })
    const { data: verification } = await this.$axios.post(`/verify${hostOrgId ? '?hostOrgId=' + hostOrgId : ''}`, { policyId, policyName })

    return verification
  },

  async completeVerification({ commit, dispatch }, { verifyId, walletId }) {
    commit('setFetching', true, { root: true })

    try {
      await this.$axios.post(`/verify/${verifyId}/approve`, { walletId })
      commit('setSnackbarText', 'Accepted verification request.', { root: true })
      commit('cacheVerifyId', null)
    } catch (e) {
      console.error(`error while completing verification for verification '${verifyId}' and walletId '${walletId}'.`)
      commit('setSnackbarText', 'Whoops! There was a problem accepting the verification request. Please retry.', { root: true })
    }

    commit('setFetching', false, { root: true })
  },

  async listVerificationPolicies({ commit }, hostOrgId) {
    const url = hostOrgId ? `/verifications/policies?hostOrgId=${hostOrgId}` : `/verifications/policies`
    const { data: policies } = await this.$axios.get(url)

    const r = {}
    policies.forEach((policy) => {
      if (!r[policy.name] || Number(policy.version) > Number(r[policy.name].version)) {
        r[policy.name] = policy
      }
    })

    const result = Object.keys(r).map((policyName) => {
      return r[policyName]
    })

    result.sort((a, b) => {
      return a.name.localeCompare(b.name)
    })

    commit('setVerificationPolicies', result)
    return result
  },

  async getProof({ commit }, { verificationId, hostOrgId }) {
    if (!hostOrgId) {
      return
    }
    const { data: verification } = await this.$axios.get(`/verifications/${verificationId}?hostOrgId=${hostOrgId}`)
    return verification
  },

  async getCredential({ commit }, { credentialId, walletId }) {
    if (!walletId) return
    const { data: credential } = await this.$axios.get(`/custodian/credential/${walletId}/${credentialId}`)
    return credential
  },

  async getVerification({ commit, getters }, orgId) {
    const id = getters.verifyId
    if (id) {
      const { data } = await this.$axios.get(`/verify/${id}`)
      const { verificationId } = data
      if (verificationId) {
        const { data } = await this.$axios.get(`/verifications/${verificationId}?hostOrgId=${orgId}`)
        commit('setVerification', data.proof)
      }
    }
  },

  async grabProposedVerificationRequest({ commit, state }, { id, load, reload }) {
    if (!load && !reload && !state.proposedVerificationRequest) {
      // set the id in
      commit('setProposedVerificationRequest', {
        id
      })

      return
    }

    if (load && !reload && state.proposedVerificationRequest && state.proposedVerificationRequest.state) {
      // if asked to load but the status is already set to something, ignore request.

      return
    }

    const preCredentialId =
      state.proposedVerificationRequest &&
      state.proposedVerificationRequest.credential &&
      state.proposedVerificationRequest.credential.credentialId

    commit('setProposedVerificationRequest', {
      id,
      state: 'Loading'
    })

    const load1 = async () => {
      const { data: v } = await this.$axios.get(`/verify/consent/${id}`)
      return v
    }

    const load2 = async () => {
      let tries = 10

      while (tries > 0) {
        tries--
        const v = await load1()
        if (!v.credential || v.credential.credentialId === preCredentialId) {
          await new Promise((r) => setTimeout(r, 4000))
          continue
        }
        return v
      }

      return null
    }

    try {
      const verificationRequest = await (reload ? load2 : load1)()

      const proposedVerificationRequest = {
        id,
        credential: verificationRequest.credential,
        state: verificationRequest.state,
        request: verificationRequest,
        policyName: verificationRequest.policyName,
        verifierName: verificationRequest.verifier.name,
        orgName: verificationRequest.organization.name,
        outdatedCredential: false
      }

      const credDateOfIssue =
        verificationRequest.credential && verificationRequest.credential.values && verificationRequest.credential.values.issuedDateUtc

      if (credDateOfIssue) {
        const now = DateTime.utc()
        const issueDate = DateTime.fromFormat(credDateOfIssue, 'LL/dd/yyyy HH:mm:ss')
        const elapsed = Interval.fromDateTimes(issueDate, now).count('hour')

        proposedVerificationRequest.outdatedCredential = elapsed > 24
      }

      if (verificationRequest.credential) {
        const [guid, num, schemaName, schemaVersion] = verificationRequest.credential.schemaId.split(':')
        proposedVerificationRequest.schema = `${schemaName}:${schemaVersion}`
      }

      commit('setProposedVerificationRequest', proposedVerificationRequest)
    } catch (e) {
      commit('setProposedVerificationRequest', {
        id,
        state: 'Failed'
      })
    }
  }
}
