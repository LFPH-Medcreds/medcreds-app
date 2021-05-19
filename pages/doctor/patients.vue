<template>
  <div>
    <transition name="fade-transition">
      <v-container fluid fill-height class="animated">
        <v-col cols="12" justify="center">
          <transition name="fade-transition">
            <DoctorUsers v-if="wallet && user" :wallet="wallet" :user="user" title="Patients" />
          </transition>
        </v-col>
      </v-container>
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import global from '@/mixins/global'
import DoctorUsers from '@/components/tables/doctor-users'
import selectedOrgMixin from '@/mixins/selectedOrg'

export default {
  mixins: [global, selectedOrgMixin],

  components: {
    DoctorUsers
  },

  async fetch() {
    await this.getWallet()
  },

  fetchOnServer: false,

  computed: {
    ...mapGetters({
      user: 'users/user',
      wallet: 'users/orgwallet'
    }),

    name() {
      return user && user.organizations && user.organizations.length && user.organizations[0].name
    }
  },

  data() {
    return {}
  },

  methods: {
    ...mapActions({
      getWallet: 'users/getOrgWallet'
    })
  }
}
</script>
