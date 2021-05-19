<template>
  <v-dialog
    v-model="showInviteFriendModal"
    persistent
    max-width="470px"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    @click:outside="toggleInviteFriendModal()"
  >
    <v-card class="py-1">
      <v-card-title>
        <Logo title="Invite a Friend" :modalTitle="true" />
      </v-card-title>

      <v-card-text class="py-0">
        <v-col cols="12">
          <v-list :key="instance" width="100%">
            <v-card-subtitle
              >Invite people you would like to request proof of their temperature or daily health assessments!
            </v-card-subtitle>
            <v-list-item v-show="'sms' === channel">
              <v-list-item-title style="display: block; width: 100%">
                <PhoneInput v-model="phone" />
              </v-list-item-title>
            </v-list-item>

            <v-list-item v-show="'email' === channel">
              <v-list-item-title style="display: block; width: 100%">
                <v-text-field v-model="email" label="Email" placeholder="invited@person.com" autofocus :append-icon="getEmailIcon(email)" />
              </v-list-item-title>
            </v-list-item>

            <v-list-item>
              <v-row>
                <v-col class="pl-4" cols="8" style="font-size: 12px; color: #333"> You may invite using either SMS or Email. </v-col>
                <v-col cols="3">
                  <v-btn-toggle v-model="channel" color="blue accent-3" group mandatory>
                    <v-btn value="sms">SMS</v-btn>
                    <v-btn value="email">Email</v-btn>
                  </v-btn-toggle>
                </v-col>
              </v-row>
            </v-list-item>
          </v-list>
        </v-col>
        <transition name="fade-transition">
          <v-row v-show="deliveryError.length">
            <v-col>
              <span class="red--text subheading">
                <div style="text-align: center">{{ deliveryError }}</div>
              </span>
            </v-col>
          </v-row>
        </transition>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="secondary" @click="toggleInviteFriendModal()">Close</v-btn>
        <v-btn
          color="primary"
          @click="
            invite({ email, phone, body, hostOrgId: null, roles })
            index = 'invite'
          "
          :loading="fetching && index == 'invite'"
          :disabled="!formValid || (fetching && index == 'invite')"
        >
          Send Invite
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import PhoneInput from '@/components/phone-input'
import global from '@/mixins/global'
import selectedOrgMixin from '@/mixins/selectedOrg'
import Logo from '@/components/logo'
import validator from 'validator'

export default {
  mixins: [global, selectedOrgMixin],
  components: {
    Logo,
    PhoneInput
  },
  data() {
    return {
      instance: 0,
      to: null,
      channel: 'sms',
      email: '',
      phone: null,
      body: ' ',
      invitingOrg: null,
      role: null,
      roles: null,
      index: -1
    }
  },
  computed: {
    ...mapGetters({
      showInviteFriendModal: 'users/showInviteFriendModal',
      fetching: 'fetching',
      org: 'users/org',
      user: 'users/user',
      deliveryError: 'users/deliveryError'
    }),
    formValid() {
      const { phone, email } = this
      return phone || (email && validator.isEmail(email))
    }
  },
  methods: {
    ...mapMutations({
      toggleInviteFriendModal: 'users/toggleInviteFriendModal'
    }),
    ...mapActions({
      sendInvite: 'users/sendInvite'
    }),

    async invite({ email, phone, body, hostOrgId, roles }) {
      const { sendInvite } = this
      try {
        await sendInvite({ email, phone, body, hostOrgId, roles, popupName: 'toggleInviteFriendModal' })
      } catch (e) {
        this.index = -1
      }
    },
    cleanModal() {
      this.index = -1
      this.to = null
      this.email = ''
      this.phone = null
      this.invitingOrg = null
      this.roles = null
      this.channel = 'sms'
    }
  },
  watch: {
    showInviteFriendModal() {
      this.instance++
      if (!this.showInviteFriendModal) {
        this.cleanModal()
      }
    },
    channel(channel) {
      if (channel === 'email') {
        this.phone = null
      }
      if (channel === 'sms') {
        this.email = ''
      }
    }
  }
}
</script>
