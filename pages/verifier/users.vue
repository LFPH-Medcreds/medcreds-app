<template>
  <div>
    <transition name="fade-transition">
      <v-container fluid fill-height class="animated">
        <v-col cols="12" justify="center">
          <transition name="fade-transition">
            <VerifierUsers v-if="user && wallet" :wallet="wallet" :user="user" title="Patients" />
          </transition>
        </v-col>
      </v-container>
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import global from '@/mixins/global'
import selectedOrgMixin from '@/mixins/selectedOrg'
import VerifierUsers from '@/components/tables/verifier-users'

export default {
  mixins: [global, selectedOrgMixin],

  components: {
    VerifierUsers
  },

  async mounted() {
    await this.getWallet()
  },

  computed: {
    ...mapGetters({
      user: 'users/user',
      wallet: 'users/orgwallet'
    })
  },

  methods: {
    ...mapActions({
      getWallet: 'users/getOrgWallet'
    })
  }
}
</script>
