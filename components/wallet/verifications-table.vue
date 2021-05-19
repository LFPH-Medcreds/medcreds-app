<template>
  <div>
    <v-card elevation>
      <v-card-title>
        <v-container fluid class="ml-1 mr-1">
          <v-row>
            <v-col cols="12">
              {{ title }}
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="search" color="primary" append-icon="mdi-magnify" label="Search" single-line hide-details />
            </v-col>
            <v-col cols="12" md="6" v-bind:align="$vuetify.breakpoint.smAndDown ? 'center' : 'right'">
              <v-btn-toggle v-model="period" color="primary" tile dense group mandatory>
                <v-btn value="day" class="ma-0 pa-1">Today</v-btn>
                <v-btn value="week" class="ma-0 pa-1">Week</v-btn>
                <v-btn value="month" class="ma-0 pa-1">Month</v-btn>
              </v-btn-toggle>
            </v-col>
          </v-row>
        </v-container>
      </v-card-title>

      <VerificationProofs
        :wallet="wallet"
        id="verifier-verifications"
        :user="user"
        :short-descriptions="true"
        :auto-open-new="true"
        :filter="search"
        :filter-after-utc="filterAfterUtc"
        :verifications="verifications"
      />
    </v-card>
  </div>
</template>

<script>
import VerificationProofs from '@/components/proofs/VerificationProofs'
import moment from 'moment'

export default {
  props: {
    wallet: Object,
    user: Object,
    title: {
      type: String,
      default: 'Verification Requests'
    },
    policyId: String,
    proofName: String,
    generateQR: Function
  },

  components: {
    VerificationProofs
  },

  data() {
    return {
      openFirst: false,
      search: '',
      period: 'day'
    }
  },

  computed: {
    verifications() {
      return this.wallet.verificationRequests.filter((v) => {
        return v.policyId === this.policyId && v.verificationId
      })
    },

    totalVerifications() {
      return this.verifications.length
    },

    filterAfterUtc() {
      const { period } = this

      const now = moment.utc()

      if (period === 'day') {
        return now.subtract(1, 'day')
      } else if (period === 'week') {
        return now.subtract(1, 'week')
      } else if (period === 'month') {
        return now.subtract(1, 'month')
      }
    }
  },

  watch: {
    totalVerifications() {
      this.newVerification()
    }
  },

  methods: {
    async newVerification() {
      const { verifications } = this
      if (!verifications.length) {
        return
      }

      const first = verifications[0]
      const verificationId = first && first.verificationId
      if (verificationId) {
        this.generateQR()
        this.$forceUpdate()
      }
    }
  }
}
</script>
