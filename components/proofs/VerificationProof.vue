<template>
  <v-expansion-panel @change="loadDetails" :disabled="!verification.verificationId || !verification.holder">
    <v-expansion-panel-header ripple>
      <v-list two-line subheader class="pa-0">
        <v-list-item class="pa-0">
          <v-list-item-avatar>
            <v-avatar color="light-blue lighten-1" v-if="verification.verificationId && verification.holder">
              <v-icon color="white">mdi-account-search-outline</v-icon>
            </v-avatar>
            <v-avatar color="#f8ae23" v-else>
              <v-icon color="white">mdi-account-clock-outline</v-icon>
            </v-avatar>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>
              <div style="white-space: normal">
                <span v-if="$vuetify.breakpoint.smAndUp && !shortDescription">
                  <div v-if="verification.holder">
                    <strong>{{ holderDisplayName }}</strong> shared {{ verification.policyName }} with
                    <strong>{{ verifierDisplayName }}</strong>
                  </div>
                  <div v-else-if="!displayAsConsent">
                    <strong>{{ verifierDisplayName }}</strong> requested {{ verification.policyName }} from
                    <strong>{{ holderDisplayName }}</strong>
                  </div>
                </span>
                <span v-else>
                  <strong> {{ displayAsConsent ? verifierDisplayName : holderDisplayName }} </strong>, {{ verification.policyName }}
                </span>
              </div>
            </v-list-item-title>

            <v-list-item-subtitle>{{ formattedTime }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-expansion-panel-header>

    <v-expansion-panel-content v-if="verification.verificationId">
      <div v-if="loading" style="text-align: center">
        <v-progress-circular indeterminate size="35" color="blue" />
        <div class="overline my-2">fetching details from ledger</div>
      </div>

      <v-divider v-if="verificationDetails" />

      <div v-if="verificationDetails && verificationDetails.state === 'Requested'">
        <v-list dense>
          <v-list-item>
            <v-list-item-subtitle>State</v-list-item-subtitle>
            <v-list-item-title class="text-right">{{ verificationDetails.state }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </div>
      <div v-else-if="verificationDetails && verificationDetails.proof">
        <ProofOfTestResult v-if="policyName === 'Proof of Test Result:3.1'" :test-details="verificationDetails.proof.TestDetails" />

        <ProofOfTemperature
          v-else-if="policyName === 'Proof of Temperature:1.0'"
          :daily-temp-check="verificationDetails.proof.DailyTempCheck"
        />

        <ProofOfSelfCheck
          v-else-if="policyName === 'Proof of Self Check:1.1'"
          :daily-self-check="verificationDetails.proof.DailySelfCheck"
        />

        <div v-else>Unknown policy: {{ policyName }}</div>
      </div>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import ProofOfTestResult from '@/components/proofs/ProofOfTestResult'
import ProofOfTemperature from '@/components/proofs/ProofOfTemperature'
import ProofOfSelfCheck from '@/components/proofs/ProofOfSelfCheck'
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      verificationDetails: null,
      loading: false,
      refreshInterval: null,
      formattedTime: null
    }
  },

  components: {
    ProofOfTestResult,
    ProofOfTemperature,
    ProofOfSelfCheck
  },

  props: {
    verification: Object,
    displayAsConsent: Boolean,
    shortDescription: Boolean,
    user: Object,
    preLoad: Boolean
  },

  mounted() {
    if (this.preLoad) {
      this.loadDetails()
    }

    this.updateFormattedTime()
    if (!this.refreshInterval) {
      this.refreshInterval = setInterval(() => {
        this.updateFormattedTime()
      }, 5 * 1000)
    }
  },

  beforeDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
    }
  },

  watch: {
    preLoad() {
      if (this.preLoad) {
        this.loadDetails()
      }
    },
    verification() {
      this.verificationDetails = null
      if (this.preLoad) {
        this.loadDetails()
      }
    }
  },

  computed: {
    policyName() {
      const { verificationDetails } = this

      if (verificationDetails && verificationDetails.schemaId) {
        let schema = verificationDetails && verificationDetails.schemaId.split(':')
        return `${schema[2]}:${schema[3]}`
      } else if (verificationDetails && verificationDetails.policy) {
        const { name, version } = verificationDetails.policy
        return `${name}:${version}`
      } else {
        return `Unknown Schema`
      }
    },

    verifierDisplayName() {
      if (this.currentUserIsVerifier) {
        return 'You'
      }

      const { organization, verifier } = this.verification
      return organization && organization.name === 'MedCreds Network' ? verifier.name : organization.name
    },

    displayTime() {
      const { verification, displayAsConsent } = this

      if (!verification.verificationId || !displayAsConsent) {
        return verification.createdAt
      }

      return verification.updatedAt
    },

    holderDisplayName() {
      if (this.currentUserIsHolder) {
        return 'You'
      }

      const { holder, recipient } = this.verification
      return (holder && holder.name) || recipient
    },

    currentUserIsVerifier() {
      if (!this.verification || !this.user) {
        return false
      }

      const { verifier } = this.verification
      return verifier && verifier.email === this.user.email
    },

    currentUserIsHolder() {
      if (!this.verification || !this.user) {
        return false
      }

      const { holder } = this.verification
      return holder && holder.email === this.user.email
    }
  },

  methods: {
    ...mapActions({
      getProof: 'ssi/getProof'
    }),

    updateFormattedTime() {
      this.formattedTime = this.$options.filters.utcAgo(this.displayTime)
    },

    async loadDetails() {
      if (this.verificationDetails || !this.verification.verificationId) {
        return
      }

      this.loading = true

      try {
        this.verificationDetails = await this.getProof({
          verificationId: this.verification.verificationId,
          hostOrgId: this.verification.organization.id
        })
      } catch (e) {
        console.error(`Failed to load details for verification ${this.verification.verificationId}.`)
      }

      this.loading = false

      this.$nextTick(() => {
        this.$forceUpdate()
      })
    }
  }
}
</script>
