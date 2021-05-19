<script>
import { mapGetters, mapActions } from 'vuex'
import global from '@/mixins/global'
import CertifiedCredentials from '@/components/creds/CertifiedCredentials'
import VerificationProofs from '@/components/proofs/VerificationProofs'
import walletFilters from '@/mixins/wallet-filters'

export default {
  components: {
    CertifiedCredentials,
    VerificationProofs
  },

  mixins: [walletFilters, global],

  fetch() {
    this.getWallet()
  },

  data() {
    return {
      tab: 'Credentials'
    }
  },

  computed: {
    ...mapGetters({
      user: 'users/user',
      wallet: 'users/wallet',
      fetching: 'fetching'
    })
  },

  methods: {
    ...mapActions({
      getWallet: 'users/getWallet'
    })
  }
}
</script>

<template>
  <transition-group name="fade-transition">
    <div style="margin-top: 200px; text-align: center" v-if="!wallet" key="loading-progress">
      <v-progress-circular indeterminate size="50" color="blue" />
      <div class="overline mt-3">Loading your wallet</div>
    </div>

    <v-row key="other-stuff" v-if="wallet" justify="center" class="animated">
      <v-col cols="12" sm="11" md="10" lg="6">
        <v-row justify="center" class="animated" :class="{ 'pa-3': $vuetify.breakpoint.mdAndUp }">
          <v-col cols="12" sm="12">
            <v-list subheader two-line>
              <v-list-item>
                <div class="subtitle-2 mt-3" style="overflow-wrap: normal !important; font-weight: 400">
                  Your ProofMarket Health Wallet allows you to receive, hold, and issue digital Credentials, as well as request verification
                  proofs of other people's digital Credentials.
                </div>
              </v-list-item>
            </v-list>

            <v-img src="/covid-immune.svg" eager style="transform: scaleX(-1)" />
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" sm="11" md="10" lg="6" class="pa-3">
        <transition-group name="fade-transition">
          <v-card id="holder-wallet" v-if="wallet" key="wallet" class="mt-5">
            <v-toolbar color="blue" dark flat>
              <v-toolbar-title>Your Health Digital Wallet</v-toolbar-title>

              <v-spacer></v-spacer>

              <template v-slot:extension>
                <v-tabs v-model="tab" center-active grow style="margin: 0">
                  <v-tabs-slider color="yellow"></v-tabs-slider>

                  <v-tab v-for="item in ['Health Creds', 'Sent Requests', 'Sent Consents']" :key="item">
                    {{ item }}
                  </v-tab>
                </v-tabs>
              </template>
            </v-toolbar>

            <v-tabs-items v-model="tab">
              <v-tab-item key="Health Creds">
                <CertifiedCredentials id="wallet-credential-list" :wallet="wallet" :credentials="wallet.credentials" />
              </v-tab-item>

              <v-tab-item key="Sent Requests">
                <VerificationProofs
                  :verifications="wallet.verificationRequests"
                  :user="user"
                  :wallet="wallet"
                  id="wallet-verification-list"
                />
              </v-tab-item>

              <v-tab-item key="Sent Consents">
                <VerificationProofs
                  :verifications="wallet.verificationConsents"
                  :user="user"
                  :wallet="wallet"
                  :display-as-consents="true"
                  id="wallet-consent-list"
                />
              </v-tab-item>
            </v-tabs-items>
          </v-card>
        </transition-group>
      </v-col>
    </v-row>
  </transition-group>
</template>
