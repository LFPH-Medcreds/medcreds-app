<script>
import CertifiedTestResult from '@/components/creds/CertifiedTestResult'
import CertifiedTemperature from '@/components/creds/CertifiedTemperature'
import CertifiedSelfCheck from '@/components/creds/CertifiedSelfCheck'
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      credDetails: null,
      loading: false,
      refreshInterval: null,
      formattedTime: null
    }
  },

  props: {
    credential: Object,
    wallet: Object
  },

  components: {
    CertifiedTestResult,
    CertifiedTemperature,
    CertifiedSelfCheck
  },

  mounted() {
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

  methods: {
    ...mapActions({
      getCredential: 'ssi/getCredential'
    }),

    async loadDetails() {
      const { credentialId } = this.credential
      const { walletId } = this.wallet

      if (this.credDetails) {
        return
      }

      this.loading = true

      try {
        this.credDetails = await this.getCredential({ credentialId, walletId })
      } catch (e) {
        console.error(`Failed to load details for credential ${credentialId}.`)
      }

      this.loading = false

      this.$nextTick(() => {
        this.$forceUpdate()
      })
    },

    getSchema(credential) {
      if (credential) {
        const { schemaName, schemaVersion } = credential
        return `${schemaName}:${schemaVersion}`
      }
    },

    updateFormattedTime() {
      this.formattedTime = this.$options.filters.utcAgo(this.credential.createdAt)
    }
  }
}
</script>

<template>
  <v-expansion-panel @change="loadDetails" v-model="credDetails">
    <v-expansion-panel-header>
      <v-list subheader two-line class="pa-0">
        <v-list-item class="pa-0">
          <v-list-item-content>
            <v-list-item-title v-text="credential.schemaName"></v-list-item-title>
            <v-list-item-subtitle>
              {{ formattedTime }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-expansion-panel-header>

    <v-expansion-panel-content v-if="credential.credentialId">
      <div v-if="loading" style="text-align: center">
        <v-progress-circular indeterminate size="35" color="blue" />
        <div class="overline my-2">fetching details from ledger</div>
      </div>

      <v-divider v-if="credDetails" />

      <div v-if="false">
        <v-list dense>
          <v-list-item>
            <v-list-item-subtitle>State</v-list-item-subtitle>
            <v-list-item-title class="text-right">{{ credDetails.state }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </div>

      <div v-if="credDetails">
        <CertifiedTestResult :credential="credDetails" v-if="getSchema(credential) === 'Certified Test Result:3.0'" />

        <CertifiedTemperature :credential="credDetails" v-if="getSchema(credential) === 'Certified Temperature:1.0'" />

        <CertifiedSelfCheck :credential="credDetails" v-if="getSchema(credential) === 'Certified Self Check:1.1'" />
      </div>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>
