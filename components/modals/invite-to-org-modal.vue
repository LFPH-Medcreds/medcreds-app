<template>
  <v-dialog
    v-model="showInvite2OrgModal"
    persistent
    :fullscreen="$vuetify.breakpoint.xsOnly"
    max-width="470px"
    @click:outside="toggleInvite2OrgModal()"
  >
    <v-card class="py-1">
      <v-card-title>
        <Logo :title="`Invite to ${hostOrgName}`" :modalTitle="true" />
      </v-card-title>

      <v-card-text class="py-0">
        <v-col cols="12">
          <v-list width="100%">
            <v-card-subtitle class="pt-0">You can invite new members or patients to {{ hostOrgName }}.</v-card-subtitle>

            <v-list-item v-show="channel === 'sms'">
              <v-list-item-title style="display: block; width: 100%">
                <PhoneInput v-model="phone" />
              </v-list-item-title>
            </v-list-item>

            <v-list-item v-show="channel === 'email'">
              <v-list-item-title style="display: block; width: 100%">
                <v-text-field v-model="email" label="Email" placeholder="invited@person.com" autofocus :append-icon="getEmailIcon(email)" />
              </v-list-item-title>
            </v-list-item>

            <v-list-item>
              <v-row>
                <v-col style="text-align: center" cols="8"> You may invite using either SMS or Email. </v-col>
                <v-col cols="3">
                  <v-btn-toggle v-model="channel" color="primary" group mandatory>
                    <v-btn value="sms">SMS</v-btn>
                    <v-btn value="email">Email</v-btn>
                  </v-btn-toggle>
                </v-col>
              </v-row>
            </v-list-item>

            <v-card-subtitle class="pt-0 pb-0">
              <v-divider />
              <div style="text-align: center">
                <v-btn-toggle v-model="metaRole" color="primary" group mandatory>
                  <v-btn value="patient">Patient</v-btn>
                  <v-btn value="user">Organization Member</v-btn>
                </v-btn-toggle>
              </div>
            </v-card-subtitle>

            <v-list-item dense v-if="metaRole === 'user'">
              <v-list-item-title style="display: block; width: 100%">
                <v-select
                  v-model="roles"
                  label="Roles"
                  hint="Chose the roles for the invited member"
                  persistent-hint
                  :items="validRoles"
                  multiple
                >
                  <template v-slot:selection="{ item }">
                    <v-chip class="ma-1 py-4 px-2">
                      <span>{{ item }}</span>
                    </v-chip>
                  </template>
                </v-select>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>

        <transition name="fade-transition">
          <v-row v-show="deliveryError.length">
            <v-col>
              <span class="red--text subheading">
                <div style="text-align: center">
                  {{ deliveryError }}
                </div>
              </span>
            </v-col>
          </v-row>
        </transition>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="toggleInvite2OrgModal()"> Close</v-btn>
        <v-btn
          color="primary"
          @click="
            invite({ email, phone, body, hostOrgId: selectedOrg && selectedOrg.id, metaRole, roles })
            index = 'invite'
          "
          :loading="fetching && index === 'invite'"
          :disabled="!formValid || (fetching && index === 'invite')"
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
import validator from 'validator'
import Logo from '@/components/logo'

export default {
  mixins: [global, selectedOrgMixin],
  components: {
    PhoneInput,
    Logo
  },
  data() {
    return {
      to: null,
      metaRole: 'patient',
      channel: 'sms',
      email: '',
      phone: null,
      body: ' ',
      role: null,
      roles: null,
      index: -1
    }
  },
  computed: {
    ...mapGetters({
      showInvite2OrgModal: 'users/showInvite2OrgModal',
      fetching: 'fetching',
      org: 'users/org',
      user: 'users/user',
      deliveryError: 'users/deliveryError'
    }),
    formValid() {
      const { phone, email, metaRole, roles } = this

      if (!phone && !validator.isEmail(email || '')) {
        return false
      }

      if (metaRole === 'user') {
        return roles && roles.length > 0
      }

      return true
    },
    validRoles() {
      return ['admin', ...this.selectedOrg.roles]
    }
  },
  methods: {
    ...mapMutations({
      toggleInvite2OrgModal: 'users/toggleInvite2OrgModal'
    }),
    ...mapActions({
      sendInvite: 'users/sendInvite'
    }),

    async invite({ email, phone, body, hostOrgId, metaRole, roles }) {
      const { sendInvite } = this

      if (metaRole === 'patient') {
        roles = []
      }

      try {
        if (phone || email) {
          await sendInvite({ email, phone, body, hostOrgId, roles })
        } else {
          this.deliveryError = 'Neither phone number nor email provided.'
        }
      } catch (e) {
        this.index = -1
      }
    },

    cleanModal() {
      this.index = -1
      this.to = ''
      this.email = ''
      this.phone = null
      this.roles = null
      this.channel = 'sms'
      this.metaRole = 'patient'
    }
  },
  watch: {
    showInvite2OrgModal(show) {
      if (!show) {
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
