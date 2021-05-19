import moment from 'moment'
import { getPickerDate } from '@/utils/date'
import _ from 'lodash'

export const strict = false

const ascendingByTime = (a, b) => {
  const timeA = new moment(a.createdAt)
  const timeB = new moment(b.createdAt)
  return timeA > timeB ? -1 : 1
}

// pulls unique objects from array with the prop extracted by the key function
// keeps the last occurrence of a duplicate object
const distinctBy = (data, key) => [...new Map(data.map((x) => [key(x), x]).values())].map((item) => item[1])

export const state = () => ({
  user: null,
  selectedOrg: null,
  isDoctor: false,
  isPatient: true,
  isVerifier: false,
  isAdmin: false,
  isRoot: false,
  showInvite2OrgModal: false,
  showInviteFriendModal: false,
  showSendVerificationModal: false,
  showMassEmailModal: false,
  showPatientModal: false,
  showTempModal: false,
  showSelfCheckModal: {
    showState: false,
    forSelf: null,
    forOther: null
  },
  showCredentialModal: false,
  showProofList: true,
  verifySMSModalPresets: false,
  testNames: [],
  mfgs: [],
  loginError: '',
  twoFactorAuthNonse: null,
  deliveryError: '',
  filterBy: 'all',
  tests: null,
  wallet: null,
  orgwallet: null,
  activePatient: null,
  org: null,
  patients: [],
  verified: []
})

export const getters = {
  user: (state) => state.user,
  selectedOrg: (state) => state.selectedOrg,
  isDoctor: (state) => state.isDoctor,
  isPatient: (state) => state.isPatient,
  isVerifier: (state) => state.isVerifier,
  isAdmin: (state) => state.isAdmin,
  isRoot: (state) => state.isRoot,
  showInvite2OrgModal: (state) => state.showInvite2OrgModal,
  showInviteFriendModal: (state) => state.showInviteFriendModal,
  showSendVerificationModal: (state) => state.showSendVerificationModal,
  showMassEmailModal: (state) => state.showMassEmailModal,
  showProofList: (state) => state.showProofList,
  showPatientModal: (state) => state.showPatientModal,
  showTempModal: (state) => state.showTempModal,
  showSelfCheckModal: (state) => state.showSelfCheckModal,
  showCredentialModal: (state) => state.showCredentialModal,
  verifySMSModalPresets: (state) => state.verifySMSModalPresets,
  loginError: (state) => state.loginError,
  twoFactorAuthNonse: (state) => state.twoFactorAuthNonse,
  deliveryError: (state) => state.deliveryError,
  filterBy: (state) => state.filterBy,
  tests: (state) => state.tests,
  patients: (state) => state.patients,
  verified: (state) => state.verified,
  wallet: (state) => state.wallet,
  orgwallet: (state) => state.orgwallet,
  mfgs: (state) => state.mfgs,
  activePatient: (state) => state.activePatient,
  org: (state) => {
    // Default to first org
    let result = state.org
    if (!result) {
      const user = state.user
      if (user) {
        result = user && user.organizations && user.organizations.length && user.organizations[0]
      }
    }
    return result
  },
  testNames: (state) => state.testNames
}

export const mutations = {
  setFilterBy(state, filterBy) {
    state.filterBy = filterBy
  },

  setActivePatient(state, activePatient) {
    state.activePatient = activePatient
  },

  toggleShowProofList(state) {
    state.showProofList = !state.showProofList
    localStorage.setItem('showProofList', state.showProofList)
  },

  setShowProofList(state, show) {
    state.showProofList = show
  },

  setWallet(state, { wallet, version }) {
    // this is a hack to avoid modifying the state so much...
    const prevVersion = state.wallet && state.wallet.version
    if (version && prevVersion === version) {
      return
    }

    let { credentials, connections, verificationRequests, verificationConsents, walletId } = wallet

    credentials = credentials.map((credential) => {
      credential.connection = connections.find((connection) => connection.connectionId === credential.connectionId)
      return credential
    })

    connections.sort(ascendingByTime)

    connections = distinctBy(connections, (connection) => connection.connectionId)

    verificationRequests.sort(ascendingByTime)
    verificationConsents.sort(ascendingByTime)

    state.wallet = _.cloneDeep({ credentials, connections, verificationRequests, verificationConsents, walletId, version })
  },

  setOrgWallet(state, { orgWallet, version }) {
    // this is a hack to avoid modifying the state so much...
    const prevVersion = state.wallet && state.wallet.version
    if (version && prevVersion === version) {
      return
    }

    let { connections, verificationRequests } = orgWallet

    connections.sort(ascendingByTime)
    connections = distinctBy(connections, (connection) => connection.connectionId)

    verificationRequests.sort(ascendingByTime)

    state.orgwallet = _.cloneDeep({ connections, verificationRequests, version })
  },

  setTests(state, tests) {
    if (!tests) return
    tests.sort(ascendingByTime)
    tests = tests.map((test) => {
      if (!test.credential.hasOwnProperty('testSubjectName')) {
        test.credential = {
          testSubjectName: test.subjectName,
          testName: '',
          testManufacturerName: '',
          testResult: 'Negative',
          testTime: getPickerDate(),
          issuedByName: '',
          issuedOnBehalfOfName: ''
        }
      }
      return test
    })

    state.tests = tests
  },

  setPatients(state, patients) {
    state.patients = patients
  },
  removePatient(state, patient) {
    if (state.patients) {
      state.patients = state.patients.filter((p) => p.email != patient.email)
    }
  },
  setVerified(state, verified) {
    state.verified = verified
  },

  setPatientTest(state, test) {
    if (!test) {
      return
    }

    let patient = state.patients.find((p) => p.id === test.patientId)
    if (!patient) {
      return
    }

    patient = {
      ...patient,
      tests: patient.tests ? [test, ...patient.tests] : [test],
      count: patient.tests ? patient.tests + 1 : 1
    }

    state.patients = state.patients.map((p) => (p.id === patient.id ? patient : p))
  },

  setUser(state, user) {
    if (!user) {
      localStorage.loginStatus = 'logged-out'
    } else if (user) {
      localStorage.loginStatus = 'logged-in'
    }

    if (!user) {
      state.wallet = null
      state.orgwallet = null
      state.user = null

      return
    }

    user.role = user.roles && user.roles[0] // hack until we need multiple roles
    user.events = user.events && user.events.map((event) => event.type)
    state.user = user

    const selectedOrgId = localStorage.getItem('selectedOrgId')
    let selectedOrg = user.organizations.find((org) => org.id === selectedOrgId)

    const firstOrg = user && user.organizations && user.organizations.length && user.organizations[0]
    selectedOrg = selectedOrg || firstOrg
    if (!state.selectedOrg && firstOrg) state.selectedOrg = selectedOrg
  },

  setTwoFactorAuthNonse(state, nonse) {
    state.twoFactorAuthNonse = nonse
  },
  setLoginError(state, error) {
    state.loginError = error
  },
  setSelectedOrg(state, org) {
    if (!org) {
      return
    }

    if (org && state.selectedOrg && org.id !== state.selectedOrg.id) {
      state.patients = []
    }

    state.selectedOrg = org

    const { orgRoles } = state.user
    if (!orgRoles) {
      return
    }

    const roles = orgRoles[state.selectedOrg.id]
    if (!roles) {
      return
    }

    let anyRoles = []
    for (const orgId in orgRoles) {
      anyRoles = [...anyRoles, ...orgRoles[orgId]]
    }

    state.isDoctor = roles.includes('doctor')
    state.isVerifier = roles.includes('verifier')
    state.isAdmin = roles.includes('admin')
    state.isPatient = !anyRoles.length
    state.isRoot = state.user.roles.includes('root')
    const { isDoctor, isAdmin, isRoot, isVerifier } = state

    localStorage.setItem('userRoles', JSON.stringify({ isDoctor, isVerifier, isAdmin, isRoot }))
  },
  setDeliveryError(state, error) {
    state.deliveryError = error
  },
  toggleInvite2OrgModal(state) {
    state.showInvite2OrgModal = !state.showInvite2OrgModal
  },
  toggleInviteFriendModal(state) {
    state.showInviteFriendModal = !state.showInviteFriendModal
  },
  toggleMassEmailModal(state) {
    state.showMassEmailModal = !state.showMassEmailModal
  },
  toggleSendVerificationModal(state, options = undefined) {
    state.showSendVerificationModal = !state.showSendVerificationModal

    const { contact, policyName } = options || {}
    if (state.showSendVerificationModal && contact) {
      state.verifySMSModalPresets = { contact, policyName }
    } else {
      state.verifySMSModalPresets = null
    }
  },
  togglePatientModal(state) {
    state.showPatientModal = !state.showPatientModal
  },
  toggleTempModal(state) {
    state.showTempModal = !state.showTempModal
  },
  toggleSelfCheckModal(state, info = { forSelf: null, forOther: null }) {
    const { showState } = state.showSelfCheckModal
    const { forSelf, forOther } = info
    state.showSelfCheckModal = {
      showState: !showState,
      forSelf: forSelf || null,
      forOther: forOther || null
    }
  },

  setTestNames(state, names) {
    state.testNames = Array.from(names).filter((name) => name)
  },
  setMfgs(state, mfgs) {
    state.mfgs = Array.from(mfgs)
  },
  setOrg(state, org) {
    state.org = org
  }
}

export const actions = {
  async patchOrgUser({ commit }, { hostOrgId, user }) {
    commit('setFetching', true, { root: true })
    const { data: patchedUser } = await this.$axios.patch(`/organizations/${hostOrgId}/users/${user.email}`, {
      orgRoles: user.orgRoles
    })
    commit('setFetching', false, { root: true })
    const message = `${user.name} roles updated.` // : `Save failed!`
    commit('setSnackbarText', message, { root: true })
  },

  async deleteOrgUser({ commit, dispatch }, { hostOrgId, user }) {
    commit('setFetching', true, { root: true })
    try {
      await this.$axios.delete(`/organizations/${hostOrgId}/users/${user.email}`)
      commit('removePatient', user)
      commit('setSnackbarText', `Removed ${user.name} from the organization!`, { root: true })
    } catch (e) {
      console.error(`Failed to delete user ${user.email} from organization ${hostOrgId}.`)
      commit('setSnackbarText', `Failed to remove ${user.name} from the organization!`, { root: true })
    }

    commit('setFetching', false, { root: true })
  },

  async getPatients({ commit, state }, { hostOrgId, start, end, clear }) {
    if (!hostOrgId) return
    commit('setPatients', [])
    commit('setFetching', true, { root: true })
    let url = `/organizations/patients?hostOrgId=${hostOrgId}`
    if (start && end) {
      url += `&start=${start.toISOString()}&end=${end.toISOString()}`
    }
    const { data: patients } = await this.$axios.get(url)
    commit('setPatients', patients)
    commit('setFetching', false, { root: true })
  },

  async getVerified({ commit }, { hostOrgId, start, end, clear }) {
    if (!hostOrgId) return
    commit('setVerified', [])
    commit('setFetching', true, { root: true })
    let url = `/organizations/verified?hostOrgId=${hostOrgId}`
    if (start && end) {
      url += `&start=${start.toISOString()}&end=${end.toISOString()}`
    }
    const { data: verified } = await this.$axios.get(url)
    commit('setVerified', verified)
    commit('setFetching', false, { root: true })
  },

  async newTest({ commit }, { hostOrgId, connectionId, email }) {
    commit('setFetching', true, { root: true })
    const { data: test } = await this.$axios.post(`/tests`, {
      hostOrgId,
      connectionId,
      email
    })
    commit('setPatientTest', test)
    commit('setFetching', false, { root: true })
    commit('setSnackbarText', 'New test record added.', { root: true })
  },

  async save({ commit, dispatch }, { test, event, hostOrgId }) {
    commit('setFetching', true, { root: true })
    await this.$axios.put('/users', { test, event, hostOrgId })
    await dispatch('getTests', hostOrgId)
    commit('togglePatientModal')
    commit('setFetching', false, { root: true })
    commit('setSnackbarText', 'Test Saved', { root: true })
  },

  async getMe({ commit, state }) {
    let { data: user } = await this.$axios.get('/users/me')
    commit('setUser', user)
  },

  async getWallet({ commit }) {
    try {
      const {
        data: wallet,
        headers: { etag }
      } = await this.$axios.get('/users/wallet');
      commit('setWallet', { wallet, version: etag })
    } catch(e) {
      if (e.response.status == 401 || e.response.status == 403) {
        await actions.logout({commit});
        this.$router.push('/');
      }
    }
  },

  async getOrgWallet({ commit, state }) {
    const hostOrgId = state.selectedOrg && state.selectedOrg.id
    if (!hostOrgId) {
      return
    }

    const {
      data: orgWallet,
      headers: { etag }
    } = await this.$axios.get(`/organizations/wallet/${hostOrgId}`)
    commit('setOrgWallet', { orgWallet, version: etag })
  },

  async getTests({ commit }, hostOrgId) {
    const { data: org } = await this.$axios.get(`/users/tests?hostOrgId=${hostOrgId}`)
    commit('setTests', org.tests)
    commit('setTestNames', org.testNames)
    commit('setMfgs', org.testMfgs)
    commit('setOrg', org)
  },

  async sendInvite({ commit }, { phone, email, body, hostOrgId, roles, popupName = 'toggleInvite2OrgModal' }) {
    commit('setDeliveryError', '')
    try {
      commit('setFetching', true, { root: true })

      const { data, status } = await this.$axios.post(`/users/invite`, { phone, email, body, hostOrgId, roles })

      commit('setFetching', false, { root: true })
      commit(popupName)

      if (status === 209) {
        commit('setSnackbarText', `The user having email/mobile '${email ? email : phone}' has already joined!`, { root: true })
      } else {
        commit('setSnackbarText', `Sent invite to user having email/mobile '${email ? email : phone}'!`, { root: true })
      }

      return data
    } catch (e) {
      commit(
        'setDeliveryError',
        `Failed to send an ${email ? 'email' : 'SMS'}. ${e}. Please try later or contact the help desk at support@medcreds.com.`
      )
      commit('setFetching', false, { root: true })
    }
  },

  async sendMassEmail({ commit }, { users, hostOrgId, subject, message }) {
    try {
      commit('setFetching', true, { root: true })
      await this.$axios.post(`/users/mass/email`, {
        users,
        message,
        subject,
        hostOrgId
      })

      commit('setSnackbarText', 'Users successfully notified!', { root: true })
      commit('toggleMassEmailModal')
      commit('setDeliveryError', '')
    } catch (e) {
      commit('setDeliveryError', `Error sending emails.`)
    }

    commit('setFetching', false, { root: true })
  },

  async login({ commit }, { email, password, router }) {
    commit('setLoginError', '')
    try {
      commit('setFetching', 'Checking your credentials', { root: true })

      const { data } = await this.$axios.post('/login', {
        email: email.toLowerCase(),
        password
      })

      if (data && data.requires2fa) {
        commit('setTwoFactorAuthNonse', data.nonse)
        router.push('/2fa')
      } else if (data && data.user) {
        const user = data.user
        user.role = user.roles && user.roles[0]

        commit('setUser', user)
        router.push('/wallet')
      } else {
        commit('setLoginError', data)
      }

      commit('setFetching', false, { root: true })
    } catch (e) {
      commit('setLoginError', 'Invalid email or password.')
      commit('setFetching', false, { root: true })
    }
  },

  async submit2fa({ commit, state }, { code, router }) {
    commit('setLoginError', '')
    try {
      commit('setFetching', 'Checking two factor code', { root: true })

      let { data: user } = await this.$axios.post('/2fa', {
        code,
        nonse: state.twoFactorAuthNonse
      })
      user.role = user.roles && user.roles[0]
      commit('setUser', user)
      router.push('/wallet')

      commit('setFetching', false, { root: true })
    } catch (e) {
      commit('setLoginError', 'Invalid or expired 2FA code.')
      commit('setFetching', false, { root: true })
    }
  },

  async requestResetPassword({ commit }, { email, router }) {
    commit('setLoginError', '')
    try {
      commit('setFetching', 'Requesting password reset', { root: true })
      await this.$axios.post('/requestResetPassword', {
        email
      })
      commit('setFetching', false, { root: true })

      router.push('/login')
    } catch (e) {
      commit('setFetching', false, { root: true })
    }
  },

  async changePassword({ commit }, { userId, password, confirmPassword, oldPassword, resetCode, router }) {
    try {
      commit('setFetching', 'Resetting password', { root: true })
      await this.$axios.post('/changePassword', {
        userId,
        password,
        confirmPassword,
        oldPassword,
        resetCode
      })

      commit('setDeliveryError', '')
      router.push(`/`)
    } catch (e) {
      console.error('error changing password', e)
      commit('setDeliveryError', 'Error changing password.')
    }

    commit('setFetching', false, { root: true })
  },

  async register({ commit, state }, { email, password, phone, name, inviteCode, router }) {
    const date = moment.utc().format('YYYY-MM-DD')
    try {
      commit('setFetching', 'Preparing your account', { root: true })
      const { data: user } = await this.$axios.post('/register', {
        email: email.toLowerCase(),
        termsAndPolicyDate: date,
        phone,
        password,
        name,
        inviteCode
      })

      user.role = user.roles && user.roles[0]
      commit('setUser', user)
      commit('setFetching', false, { root: true })

      router.push('/wallet')
    } catch (e) {
      let message = 'Error registering. Please make sure all fields are properly filled in and try again.'
      if (e.message.includes('409')) {
        message = "It looks like you've already registered. Please login normally or reset your password."
        router.push('/login')
      }
      if (e.message.includes('403')) {
        message = 'Your invitation has expired.'
      }
      if (e.message.includes('411')) {
        message = 'You must register using the phone number you were invited with.'
      }
      if (e.message.includes('412')) {
        message = 'You must register using the email you were invited with.'
      }
      commit('setLoginError', message)
      commit('setFetching', false, { root: true })
    }
  },

  async logout({ commit }) {
    try {
      await this.$axios.post('/logout')
    } catch (e) {}

    console.log('[SESSION] User has logged out.')
    await commit('setUser', null)
  },

  async checkLoginStatus({ commit, state }) {
    if (localStorage.loginStatus === 'logged-out') {
      console.log('[SESSION] User is logged out, requires login.')

      commit('setFetching', false, { root: true })
      return null
    } else if (localStorage.loginStatus === 'logged-in' && state.user) {
      console.log('[SESSION] User is logged in already.')
      return state.user
    }

    try {
      const { data: user } = await this.$axios.get('/users/me')

      commit('setUser', user)
      console.log('[SESSION] User has a previous session, trying to log in implicitly.')

      return user
    } catch (e) {
      console.error(e)

      if (state.user) {
        await this.$axios.post('/logout')
      }

      if (localStorage.loginStatus === 'logged-in') {
        console.log("[SESSION] User's previous session is invalid, requires login.")
      } else {
        console.log('[SESSION] User has no previous session, requires login.')
      }

      commit('setUser', null)
      commit('setFetching', false, { root: true })
    }
  }
}
