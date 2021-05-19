<template>
  <v-app dark>
    <Nav v-if="user" :title="title" :sub-title="subTitle" />

    <div style="text-align: center">
      <v-bottom-navigation
        class="elevation-2"
        app
        id="bottom-nav"
        :horizontal="!$vuetify.breakpoint.smAndDown"
        grow
        v-if="user && $route.path === '/wallet' && $vuetify.breakpoint.smAndDown"
      >
        <v-btn id="certify-your-health-sm" value="selfcheck" @click.stop="toggleSelfCheckModal()">
          <span v-if="!$vuetify.breakpoint.xsOnly"> Certify your Health </span>
          <span v-else> Certify </span>
          <v-icon class="mr-2">mdi-account-check</v-icon>
        </v-btn>

        <v-btn id="certify-your-temp-sm" value="temp" @click.stop="toggleTempModal()">
          <span v-if="!$vuetify.breakpoint.xsOnly"> Certify your Temp </span>
          <span v-else>Certify </span>
          <v-icon class="mr-2"> mdi-thermometer</v-icon>
        </v-btn>
        <v-btn id="invite-friend-sm" value="invite" @click.stop="toggleInviteFriendModal()">
          <span v-if="!$vuetify.breakpoint.xsOnly"> Invite a Friend </span>
          <span v-else> Invite </span>
          <v-icon class="mr-2">mdi-account-multiple-plus</v-icon>
        </v-btn>

        <v-btn
          id="verify-credential-sm"
          @click.stop="
            setUseVerifyId(false)
            toggleSendVerificationModal()
          "
        >
          <span v-if="!$vuetify.breakpoint.xsOnly"> Verify their Credential </span>
          <span v-else>Verify</span>
          <v-icon>mdi-account-search</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </div>

    <v-main>
      <LoadingIndicator v-if="fetching && !user" message="Determining next action" />
      <nuxt v-else />
    </v-main>

    <v-footer class="mobile white-background" height="30" elevation="2" v-if="false">
      <span>
        <span class="text-xs-small text--disabled mr-1">{{ title }} &copy;</span>
        <span v-for="link in links" :key="link.name" class>
          <nuxt-link :to="link.to" class="pa-1">
            {{ link.name }}
          </nuxt-link>
        </span>
      </span>
    </v-footer>

    <v-footer class="web white-background" height="30" elevation="2" v-if="false">
      <v-col cols="12" justify="left">
        <v-row justify="center">
          <v-col cols="12" sm="6" md="5" lg="4">
            <span class="text-xs-small text--disabled mr-3">{{ title }} &copy; {{ new Date().getFullYear() }}</span>
            <span v-for="link in links" :key="link.name" class="mr-1">
              <nuxt-link :to="link.to" class="pa-1">
                {{ link.name }}
              </nuxt-link>
            </span>
          </v-col>
        </v-row>
      </v-col>
    </v-footer>

    <InviteToOrgModal />
    <InviteFriendModal />
    <TempModal />
    <SelfCheckModal />
    <SendVerificationModal />
    <VerificationRequestModal />
    <v-snackbar v-model="snackbar" color="primary" bottom :timeout="3500">
      <span v-html="snackbarText" />
      <v-btn style="float: right" dark text @click="setSnackbar(false)"> Close</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import LoadingIndicator from '@/components/loading-indicator'
import InviteToOrgModal from '@/components/modals/invite-to-org-modal'
import InviteFriendModal from '@/components/modals/invite-friend-modal'
import SendVerificationModal from '@/components/modals/send-verification-modal'
import TempModal from '@/components/modals/temp-modal'
import SelfCheckModal from '@/components/modals/self-check-modal'
import VerificationRequestModal from '@/components/modals/verification-request-modal'
import Nav from '@/components/navs/nav'
import LoadingNav from '@/components/navs/loading-nav'
import global from '@/mixins/global'
import holder from '@/mixins/holder'
import walletFilters from '@/mixins/wallet-filters'
import selectedOrgMixin from '@/mixins/selectedOrg'

export default {
  mixins: [selectedOrgMixin, global, holder, walletFilters],

  components: {
    Nav,
    LoadingNav,
    InviteToOrgModal,
    InviteFriendModal,
    SendVerificationModal,
    itemType: 'credential',
    LoadingIndicator,
    TempModal,
    SelfCheckModal,
    VerificationRequestModal
  },

  async mounted() {
    const { filter } = this.$route.query

    this.setFetching(true)

    if (filter) this.setFilterBy(filter)
    if (filter) this.localFilterBy = filter
    else this.localFilterBy = this.filterBy

    const user = await this.checkLoginStatus()

    if (!user) {
      await this.$router.push('/login')
      return
    }

    if (this.$route.path.toLowerCase() === '/changepassword') {
      return this.setFetching(false)
    }
    this.setFetching(false)

    if (this.intercomEnabled) {
      try {
        await this.$intercom('boot', {
          user_id: user.email,
          name: user.name,
          email: user.email
        })
      } catch (e) {
        console.error('An error occurred while booting the Intercom component.', e)
      }
    }
  },
  computed: {
    ...mapGetters({
      user: 'users/user',
      isDoctor: 'users/isDoctor',
      isPatient: 'users/isPatient',
      isRoot: 'users/isRoot',
      isVerifier: 'users/isVerifier',
      filterBy: 'users/filterBy',
      fetching: 'fetching',
      _snackbar: 'snackbar',
      snackbarText: 'snackbarText'
    }),
    snackbar: {
      get() {
        return this._snackbar
      },
      set(val) {
        this.setSnackbar(val)
      }
    },
    title() {
      return 'ProofMarket'
    },
    subTitle() {
      return 'Peace of Mind for Everyone'
    }
  },
  methods: {
    ...mapMutations({
      toggleInviteFriendModal: 'users/toggleInviteFriendModal',
      toggleTempModal: 'users/toggleTempModal',
      toggleSendVerificationModal: 'users/toggleSendVerificationModal',
      toggleSelfCheckModal: 'users/toggleSelfCheckModal',
      setFilterBy: 'users/setFilterBy',
      setSnackbar: 'setSnackbar',
      setFetching: 'setFetching',
      setSnackbarText: 'setSnackbarText',
      setUseVerifyId: 'ssi/setUseVerifyId'
    }),
    ...mapActions({
      checkLoginStatus: 'users/checkLoginStatus'
    })
  },
  watch: {
    group() {
      this.drawer = false
    },

    async $route(to) {
      if (to.path === '/') {
        return
      }

      localStorage.currentRoute = to.path

      const user = await this.checkLoginStatus()

      if (!user && this.$route.path !== '/changePassword') {
        await this.$router.push('/login')
      }
    }
  },
  data() {
    return {
      drawer: false,
      group: null,
      navLinks: [],
      mobileNav: ''
    }
  }
}
</script>
