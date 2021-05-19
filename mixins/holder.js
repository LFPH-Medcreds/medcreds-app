import { mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      policy: null,
      policies: null
    }
  },
  mounted() {
    this.getRootOrgPolicies()
  },
  methods: {
    async getRootOrgPolicies() {
      this.policies = await this.listVerificationPolicies()
    },
    ...mapActions({
      listVerificationPolicies: 'ssi/listVerificationPolicies'
    })
  },
  computed: {
    ...mapGetters({
      fetching: 'fetching',
      org: 'users/selectedOrg',
      user: 'users/user'
    }),
    selfCheckPolicy() {
      const { policies } = this
      return policies && policies.find((policy) => policy.name === 'Proof of Self Check' && policy.version === '1.1')
    }
  }
}
