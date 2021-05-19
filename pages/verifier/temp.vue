<template>
  <div class="pt-2">
    <div v-if="!user">
      <div style="margin-top: 100px; text-align: center">
        <v-progress-circular indeterminate size="50" color="blue" />
        <div class="overline mt-3">Confirming Access</div>
      </div>
    </div>

    <div v-else>
      <v-row :justify="showProofList ? 'space-around' : 'center'">
        <v-col cols="12" sm="6" justify="center" class="animated px-4">
          <v-row justify="center" class="mt-5">
            <v-col cols="10"> </v-col>
          </v-row>

          <v-row justify="center" class="mt-5">
            <v-col cols="10" id="people-image">
              <div>
                <div style="text-align: center">
                  <p class="headline">Body Temperature <v-icon color="black" large style="margin-top: -10px"> mdi-thermometer</v-icon></p>
                </div>

                <div style="text-align: center">All employees must provide proof of temperature before entering the premises.</div>

                <QrRotator :verifyUrl="verifyUrl" :verifierPolicy="policy" />
              </div>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" sm="5" justify="center" class="animated px-4 mt-5" v-show="showProofList">
          <VerificationsTable
            v-if="wallet && policyId"
            :wallet="wallet"
            :user="user"
            :policyId="policyId"
            title="Body Temperature"
            proofName="DailyTempCheck"
            :generateQR="generateQR"
          />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import global from '@/mixins/global'
import verifier from '@/mixins/verifier'
import VerificationsTable from '@/components/wallet/verifications-table'
import QrRotator from '@/components/verifier/qr-rotator'
import selectedOrgMixin from '@/mixins/selectedOrg'

export default {
  mixins: [global, verifier, selectedOrgMixin],
  head() {
    return {
      title: 'Verify Body Temperature'
    }
  },
  data: () => ({
    valid: true,
    name: '',
    connection: {},
    e1: 1,
    steps: 2,
    vertical: false,
    altLabels: false,
    editable: true,
    verify: null,
    policyId: null
  }),
  created() {
    this.generateQR()
  },

  computed: {
    ...mapGetters({
      user: 'users/user',
      wallet: 'users/orgwallet',
      fetching: 'fetching',
      verificationResponse: 'ssi/verificationResult',
      verificationPolicies: 'ssi/verificationPolicies',
      showProofList: 'users/showProofList'
    }),

    verifyUrl() {
      return this.verify && `${window.location.origin}/?id=${this.verify.id}`
    }
  },
  methods: {
    ...mapActions({
      getWallet: 'users/getOrgWallet',
      startVerification: 'ssi/startVerification',
      verifyVerification: 'ssi/verifyVerification',
      listVerificationPolicies: 'ssi/listVerificationPolicies'
    }),
    ...mapMutations({
      cacheVerifyId: 'ssi/cacheVerifyId',
      setVerification: 'ssi/setVerification'
    }),
    getPolicyId(policies) {
      if (!policies) return
      // FIXME:WORKAROUND  this is a policy with no restrictions in place
      // TODO: do we need to update all the policies to new version?
      const policy = policies.find((policy) => policy.name === 'Proof of Temperature' && policy.version === '1.0')
      this.policy = policy
      // return 'f4ce8ffc-cf69-46dc-8012-08d7fc0f2b49'; // PrivateMedCreds.com tenant policyId 3.1
      return policy && policy.policyId
    }
  },
  components: {
    VerificationsTable,
    QrRotator
  },
  watch: {
    selectedOrg() {
      this.generateQR()
      this.getOrgWallet()
    },
    verificationPolicies: {
      deep: true,
      handler(policies) {
        this.policyId = this.getPolicyId(policies)
      }
    }
  }
}
</script>
