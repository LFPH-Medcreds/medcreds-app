<template>
  <div>
    <transition name="fade-transition">
      <v-container fluid fill-height class="animated" :class="{ 'pa-4': $vuetify.breakpoint.smAndUp }">
        <v-col cols="12" justify="center">
          <transition name="fade-transition">
            <Wallet />
          </transition>
        </v-col>
      </v-container>
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import Wallet from '@/components/wallet/holder-wallet'

export default {
  layout: 'default',
  components: {
    Wallet
  },

  head() {
    return {
      title: 'Digital Health Wallet'
    }
  },

  fetchOnServer: false,

  mounted() {
    if (!this.wallet) {
      this.getWallet()
    }

    if (!this.walletPollInterval) {
      this.walletPollInterval = setInterval(() => {
        this.getWallet()
      }, 15 * 1000)
    }
  },

  beforeDestroy() {
    if (this.walletPollInterval) {
      clearInterval(this.walletPollInterval)
    }
  },

  computed: {
    ...mapGetters({
      wallet: 'users/wallet'
    })
  },

  data() {
    return {
      walletPollInterval: null
    }
  },

  methods: {
    ...mapActions({
      getWallet: 'users/getWallet'
    })
  }
}
</script>
