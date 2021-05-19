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
            <v-col cols="10" id="people-image">
              <div>
                <div style="text-align: center">
                  <p class="headline">
                    Medical Test Results
                    <v-icon color="black" large style="margin-top: -10px">mdi-account-check</v-icon>
                  </p>
                </div>

                <div style="text-align: center">You must provide a doctor certified medical test result.</div>
                <div style="text-align: center"></div>
                <QrRotator :verifyUrl="verifyUrl" :verifierPolicy="policy" />
              </div>
            </v-col>
          </v-row>
        </v-col>
        <v-col transition="fade-transition" cols="12" sm="5" justify="center" class="animated px-4 mt-5" v-show="showProofList">
          <VerificationsTable
            v-if="wallet && policyId"
            :wallet="wallet"
            :user="user"
            :policyId="policyId"
            title="Medical Test Results"
            proofName="TestDetails"
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
      title: 'Verify Medical Test Results'
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
      listVerificationPolicies: 'ssi/listVerificationPolicies',
      getVerification: 'ssi/getVerification'
    }),
    ...mapMutations({
      cacheVerifyId: 'ssi/cacheVerifyId',
      setVerification: 'ssi/setVerification'
    }),
    getPolicyId(policies) {
      if (!policies) return
      const policy = policies.find((policy) => policy.name === 'Proof of Test Result' && policy.version === '3.1')
      this.policy = policy
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
    // user: {
    //   deep: true,
    //   handler(user) {
    //     const { hostOrgId, policyId } = this
    //     if (policyId) return;
    //     // this.listVerificationPolicies(hostOrgId)
    //   }
    // }
  }
}
</script>
