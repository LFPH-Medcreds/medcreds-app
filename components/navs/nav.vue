<template>
  <nav>
    <v-toolbar>
      <v-app-bar-nav-icon class="grey--text" @click="drawer = !drawer" id="drawer-toggle"></v-app-bar-nav-icon>

      <Logo :title="title" :sub-title="subTitle" :navBarTitle="true" />
    </v-toolbar>

    <v-navigation-drawer v-model="drawer" id="nav" app temporary>
      <v-layout column fill-height style="z-index: 100 !important">
        <v-list dense width="100%" class="ma-0 pa-0">
          <v-list-item id="nav-header">
            <v-list-item-title v-if="user" class="mb-3 py-3" style="font-size: 1rem; line-height: 1.2rem">
              <v-img :src="user.photo" v-if="user.photo" max-width="30" max-height="30" />
              <v-avatar max-width="30" v-else color="primary" style="color: white">
                {{ getInitials(user.name) }}
              </v-avatar>

              <h3 class="mb-n2" style="display: inline-block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
                {{ user.name }}
              </h3>
            </v-list-item-title>
          </v-list-item>

          <v-divider />

          <v-list-item v-if="!isPatient" v-show="selectedOrg" v-bind:disabled="organizations.length === 1">
            <v-list-item-title style="display: block; width: 100%">
              <v-select
                v-model="selectedOrg"
                id="nav-selected-org"
                item-text="name"
                return-object
                eager
                :items="organizations"
                label="Current Organization"
              >
                <template v-slot:item="{ item }" :class="item.id === selectedOrg.id ? 'highlight' : 'no-highlight'">
                  <v-list-item-avatar>
                    <v-img :src="item.logo" v-if="item && item.logo" max-width="30" max-height="30" />
                    <v-avatar v-else color="primary" style="color: white">
                      {{ getInitials(item.name) }}
                    </v-avatar>
                  </v-list-item-avatar>
                  <span>{{ item.name }}</span>
                </template>
              </v-select>
            </v-list-item-title>
          </v-list-item>

          <v-list-group v-if="isDoctor" id="nav-doctor" key="doctor" :value="isDoctor">
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Doctor Tools</v-list-item-title>
              </v-list-item-content>
            </template>

            <NavPageLink
              id="nav-doctor-patients"
              icon="mdi-account-multiple"
              text="Patients"
              tool-tip="Manage patients & credentials"
              route="/doctor/patients"
            />

            <NavPageLink
              id="nav-doctor-tests"
              icon="mdi-timeline-text-outline"
              text="Test Schedule"
              tool-tip="Schedule and manage user tests"
              route="/doctor/tests"
            />
          </v-list-group>

          <v-list-group v-if="isVerifier" id="nav-verifier" key="verifier" :value="!isDoctor && isVerifier">
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Verifier Tools</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-list-item id="nav-verifier-daily-self-check" link to="/verifier/selfcheck" exact v-bind="attrs" v-on="on">
                  <v-list-item-icon>
                    <v-icon>mdi-account-check</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>Health Assesment</v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-switch
                      id="nav-verifier-daily-self-check-list"
                      v-show="$route.path === '/verifier/selfcheck'"
                      v-model="showProofList"
                      @change="$store.commit('users/toggleShowProofList')"
                      dense
                      style="display: inline-block; font-size: 12px !important"
                      class="pl-3"
                      persistent-hint
                      ripple
                    />
                  </v-list-item-action>
                </v-list-item>
              </template>
              Request daily self check verifications
            </v-tooltip>

            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-list-item id="nav-verifier-temperature" link to="/verifier/temp" exact v-bind="attrs" v-on="on">
                  <v-list-item-icon>
                    <v-icon>mdi-thermometer</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>Body Temperature</v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-switch
                      id="nav-verifier-temperature-list"
                      v-show="$route.path === '/verifier/temp'"
                      v-model="showProofList"
                      @change="$store.commit('users/toggleShowProofList')"
                      dense
                      style="display: inline-block; font-size: 12px !important"
                      class="pl-3"
                      persistent-hint
                      ripple
                    />
                  </v-list-item-action>
                </v-list-item>
              </template>
              Request temperature verifications
            </v-tooltip>

            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-list-item id="nav-verifier-medical-test" link to="/verifier/tests" exact v-bind="attrs" v-on="on">
                  <v-list-item-icon>
                    <v-icon>mdi-qrcode-plus</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>Medical Test Results</v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-switch
                      id="nav-verifier-medical-test-list"
                      v-show="$route.path === '/verifier/tests'"
                      v-model="showProofList"
                      @change="$store.commit('users/toggleShowProofList')"
                      dense
                      style="display: inline-block; font-size: 12px !important"
                      class="pl-3"
                      persistent-hint
                      ripple
                    />
                  </v-list-item-action>
                </v-list-item>
              </template>
              Request medical test verifications
            </v-tooltip>

            <NavPageLink
              id="nav-verifier-users"
              icon="mdi-account-multiple"
              text="Verified Users"
              tool-tip="View the list of verified users"
              route="/verifier/users"
            />
          </v-list-group>

          <v-list-group v-if="isAdmin" id="nav-admin" key="admin" :value="!isDoctor && !isVerifier && isAdmin">
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Admin Tools</v-list-item-title>
              </v-list-item-content>
            </template>

            <NavPageLink
              id="nav-admin-users"
              icon="mdi-account-multiple"
              text="User Management"
              tool-tip="Add or remove organization users"
              :route="`/org/users`"
            />
          </v-list-group>

          <v-list-group key="patient" id="nav-patient" :value="isPatient">
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Personal Tools</v-list-item-title>
              </v-list-item-content>
            </template>

            <NavPageLink
              id="nav-wallet"
              icon="mdi-wallet-outline"
              text="Health Wallet"
              tool-tip="Go to Your Health Digital Wallet"
              route="/wallet"
            />

            <NavPageLink
              id="nav-contacts"
              icon="mdi-account-multiple"
              text="Manage Contacts"
              tool-tip="Add contact or assess health"
              route="/contacts"
            />

            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-list-item
                  id="nav-invite-friend"
                  v-bind="attrs"
                  v-on="on"
                  link
                  @click.stop="
                    toggleInviteFriendModal()
                    drawer = false
                  "
                >
                  <v-list-item-icon>
                    <v-icon>mdi-account-multiple-plus</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Invite a Friend</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
              Invite a friend to join ProofMarket platform
            </v-tooltip>

            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-list-item
                  id="nav-verify-credential"
                  link
                  v-bind="attrs"
                  v-on="on"
                  @click.stop="
                    setUseVerifyId(false)
                    toggleSendVerificationModal()
                    drawer = false
                  "
                >
                  <v-list-item-icon>
                    <v-icon> mdi-account-search</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Send Request</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
              Request proof of health from someone else.
            </v-tooltip>

            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-list-item
                  id="nav-certify-health"
                  link
                  v-bind="attrs"
                  v-on="on"
                  @click.stop="
                    toggleSelfCheckModal()
                    drawer = false
                  "
                >
                  <v-list-item-icon>
                    <v-icon>mdi-account-check</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Certify Self Health</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
              Self-certify your health
            </v-tooltip>

            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-list-item
                  id="nav-certify-temperature"
                  link
                  v-bind="attrs"
                  v-on="on"
                  @click.stop="
                    toggleTempModal()
                    drawer = false
                  "
                >
                  <v-list-item-icon>
                    <v-icon>mdi-thermometer</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Certify Self Temp.</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
              Self-certify your temperature
            </v-tooltip>
          </v-list-group>

          <v-divider v-if="isRoot" />

          <v-list-group v-if="isRoot" id="nav-root" key="root">
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>ProofMarket Tools</v-list-item-title>
              </v-list-item-content>
            </template>

            <NavPageLink
              id="nav-root-organizations"
              icon="mdi-domain"
              text="Manage Organization"
              tool-tip="Manage all organizations"
              route="/root/orgs"
            />
          </v-list-group>
        </v-list>

        <v-list dense width="100%">
          <v-divider />

          <v-list-item id="nav-logout" link @click.stop="logoutAndRedirect()">
            <v-list-item-icon>
              <v-icon>mdi-account-arrow-right-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-layout>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import Logo from '@/components/logo'
import NavPageLink from '@/components/navs/nav-page-link'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import global from '@/mixins/global'
import selectedOrgMixin from '@/mixins/selectedOrg'
import logo from '@/components/logo'

export default {
  mixins: [global, selectedOrgMixin],

  components: {
    Logo,
    NavPageLink
  },

  mounted() {
    this.listVerificationPolicies(this.hostOrgId)
  },

  data() {
    return {
      drawer: false,
      policyId: null
    }
  },
  props: {
    title: String,
    subTitle: String
  },
  methods: {
    ...mapMutations({
      toggleInviteFriendModal: 'users/toggleInviteFriendModal',
      setFilterBy: 'users/setFilterBy',
      toggleTempModal: 'users/toggleTempModal',
      toggleSelfCheckModal: 'users/toggleSelfCheckModal',
      toggleSendVerificationModal: 'users/toggleSendVerificationModal',
      setUseVerifyId: 'ssi/setUseVerifyId'
    }),

    ...mapActions({
      logout: 'users/logout',
      listVerificationPolicies: 'ssi/listVerificationPolicies'
    }),

    async logoutAndRedirect() {
      await this.logout()

      if (this.intercomEnabled) {
        try {
          await this.$intercom('shutdown')
        } catch (e) {
          console.error('An error occurred while shutting down the Intercom component.', e)
        }
      }
      await this.$router.push('/')
    },

    getPolicyId(policies) {
      if (!policies) {
        return
      }

      const policy = policies.find((policy) => policy.name === 'Proof of Test Result' && policy.version === '3.1')
      return policy && policy.policyId
    }
  },

  computed: {
    ...mapGetters({
      fetching: 'fetching',
      filterBy: 'users/filterBy',
      fullOrg: 'users/org',
      verifyId: 'ssi/verifyId',
      showEmailModal: 'users/showEmailModal',
      verificationPolicies: 'ssi/verificationPolicies',
      user: 'users/user'
    }),

    showProofList: {
      get() {
        return this.$store.state.users.showProofList
      },
      set() {
        this.$store.dispatch('users/toggleShowProofList')
      }
    }
  },

  watch: {
    verificationPolicies: {
      deep: true,
      handler(policies) {
        this.policyId = this.getPolicyId(policies)
      }
    },

    hostOrgId(oldOrg, newOrg) {
      if (oldOrg === newOrg) {
        return
      }

      this.listVerificationPolicies(this.hostOrgId)
    }
  }
}
</script>
