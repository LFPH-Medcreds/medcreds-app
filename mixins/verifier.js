import { mapActions, mapGetters, mapMutations } from 'vuex'
import SendVerificationModal from '@/components/modals/send-verification-modal'

export default {
  async fetch() {
    const { org, getOrgWallet, getVerification } = this
    if (org) {
      await Promise.all([getOrgWallet(), getVerification(org.id)])
    }
  },
  fetchOnServer: false,

  mounted() {
    if (!this.verifyPollInterval) {
      this.$fetch()

      this.verifyPollInterval = setInterval(() => {
        this.$fetch()
      }, 15 * 1000)
    }

    setTimeout(() => {
      this.show1 = true
    }, 100)

    const show = localStorage.getItem('showProofList')
    if (show !== null) this.$store.commit('users/setShowProofList', show !== 'false')
  },

  beforeDestroy() {
    if (this.verifyPollInterval) {
      clearInterval(this.verifyPollInterval)
    }
  },

  data() {
    return {
      verifyPollInterval: null,
      policy: null
    }
  },

  components: {
    SendVerificationModal
  },
  methods: {
    ...mapMutations({
      toggleSendVerificationModal: 'users/toggleSendVerificationModal',
      setUseVerifyId: 'ssi/setUseVerifyId',
      setVerifyPolicy: 'ssi/setVerifyPolicy'
    }),
    ...mapActions({
      getOrgWallet: 'users/getOrgWallet',
      getVerification: 'ssi/getVerification'
    }),
    async generateQR() {
      this.setVerification(null)
      this.verify = null

      const policies = await this.listVerificationPolicies(this.hostOrgId)
      const verificationReq = await this.startVerification({
        hostOrgId: this.hostOrgId,
        policyId: this.getPolicyId(policies),
        policyName: this.policyName
      })
      this.verify = verificationReq
      this.setVerifyPolicy(this.policy)
      this.cacheVerifyId(verificationReq.id)
    }
  },
  computed: {
    ...mapGetters({
      fetching: 'fetching',
      verifyId: 'ssi/verifyId',
      useVerifyId: 'ssi/useVerifyId',
      org: 'users/selectedOrg',
      user: 'users/user'
    }),

    policyName() {
      return this.policy && this.policy.name
    },

    cleanWallet() {
      const { wallet, org } = this
      let { verificationRequests: verifications } = wallet
      verifications = verifications.filter((v) => {
        return v.organization.id === org.id
      })
      return { verificationRequests: verifications }
    }
  }
}
