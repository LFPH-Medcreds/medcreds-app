<template>
  <v-dialog
    v-model="showSendVerificationModal"
    persistent
    :fullscreen="$vuetify.breakpoint.xsOnly"
    max-width="470px"
    :retain-focus="false"
    @click:outside="toggleSendVerificationModal()"
  >
    <v-card class="py-1">
      <v-card-title>
        <Logo title="Send a Proof Request" :modalTitle="true" />
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" sm="12">
            <v-list width="100%">
              <v-card-subtitle v-if="!useVerifyId">
                Ask people within your bubble for their health assessment, temperature or COVID-19 test results.
              </v-card-subtitle>
              <v-card-subtitle v-if="useVerifyId">
                Directly send the verification request currently shown as a QR in your verification portal.
              </v-card-subtitle>

              <v-list-item>
                <v-combobox
                  v-bind:id="'ver-sel-contacts-' + channel"
                  v-if="user"
                  :items="user.friends"
                  v-model="selectedFriends"
                  class="subtitle-2 mb-n3"
                  style="display: inline-block; width: 100%"
                  item-value="name"
                  item-text="name"
                  :filter="filter"
                  chips
                  multiple
                  :allow-overflow="false"
                  clearable
                  :key="channel"
                  :search-input.sync="comboInput"
                  @change="comboInput = ''"
                  v-on:click.stop
                >
                  <template v-slot:no-data>
                    <v-list-item style="max-width: 440px">
                      <v-list-item-content>
                        <v-container style="font-size: 12px; color: #333">
                          No results matching "<strong>{{ comboInput }}</strong
                          >". Press <kbd>enter</kbd> to create a new one
                        </v-container>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-combobox>
              </v-list-item>

              <v-list-item class="mt-0 pt-0">
                <v-row>
                  <v-col cols="8" class="ml-2" style="font-size: 12px; color: #333">
                    Search for existing contact or add a new one by entering their phone number or email address.
                  </v-col>
                  <v-col cols="3">
                    <v-btn-toggle v-model="channel" color="blue accent-3" group mandatory style="display: inline-block">
                      <v-btn value="sms" class="ma-0 pa-1">SMS</v-btn>
                      <v-btn value="email" class="ma-0 pa-1">Email</v-btn>
                    </v-btn-toggle>
                  </v-col>
                </v-row>
              </v-list-item>

              <v-list-item class="mt-3 mb-n5">
                <v-list-item-title style="display: block; width: 100%">
                  <v-select
                    ref="policy"
                    :label="policy ? 'Request Type' : 'Choose a Request Type'"
                    :disabled="useVerifyId"
                    :items="policies"
                    v-model="policy"
                    :async-loading="!policy"
                  >
                    <template v-slot:selection="{ item }">
                      <span v-if="item" class="subtitle-2">{{ `${item.name}` }}</span>
                    </template>
                    <template v-slot:item="{ item }">
                      <span v-if="item" class="subtitle-2">{{ `${item.name}` }}</span>
                    </template>
                  </v-select>
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-if="!useVerifyId" class="py-0" style="font-size: 12px; color: #333">
                Choose the health credential that you would like to request.<br />
                When they consent, you will be able to see their responses in the "Sent Requests" tab.
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>

        <transition name="fade-transition">
          <v-row v-show="deliveryError.length">
            <v-col>
              <span class="red--text subheading">
                <center>{{ deliveryError }}</center>
              </span>
            </v-col>
          </v-row>
        </transition>
      </v-card-text>

      <v-divider />
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="toggleSendVerificationModal()">Close</v-btn>

        <v-btn
          color="primary"
          :loading="fetching && index == 'send'"
          @click="
            verify()
            index = 'send'
          "
          :disabled="!formValid || (fetching && index == 'send' && formValid)"
        >
          Send Request
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import global from '@/mixins/global'
import holder from '@/mixins/holder'
import validators from '@/mixins/validators'
import selectedOrgMixin from '@/mixins/selectedOrg'
import Logo from '@/components/logo'
import PhoneNumber from 'awesome-phonenumber'
import validator from 'validator'

export default {
  mixins: [global, selectedOrgMixin, holder, validators],
  components: {
    Logo
  },
  data() {
    return {
      channel: 'sms',
      to: null,
      phone: '',
      email: '',
      body: ' ',
      policy: null,
      index: -1,
      focused: '',
      selectedFriends: null,
      comboInput: ''
    }
  },
  mounted() {
    this.policy = this.policy || this.selfCheckPolicy // from holder mixin
  },
  computed: {
    ...mapGetters({
      showSendVerificationModal: 'users/showSendVerificationModal',
      verifySMSModalPresets: 'users/verifySMSModalPresets',
      fetching: 'fetching',
      verifyId: 'ssi/verifyId',
      verifyPolicy: 'ssi/verifyPolicy',
      user: 'users/user',
      deliveryError: 'users/deliveryError',
      useVerifyId: 'ssi/useVerifyId'
    }),
    formValid() {
      const { selectedFriends, policy, useVerifyId, channel } = this

      if (!selectedFriends || selectedFriends.length < 1) {
        return false
      }

      for (let friend of selectedFriends) {
        let dest

        if (typeof friend === 'string') {
          dest = friend
        } else {
          dest = channel === 'email' ? friend.email : friend.phone
        }

        if (!dest) {
          return false
        }
        const validPhoneNumber = this.validateMobileNumber(dest)
        if (channel === 'sms' && !validPhoneNumber) {
          return false
        }
        if (channel === 'email' && !validator.isEmail(dest)) {
          return false
        }
        this.phone = validPhoneNumber
      }

      if (!policy && !useVerifyId) return false
      return true
    },

    policyId() {
      return this.policy && this.policy.policyId
    },
    policyName() {
      return this.policy && this.policy.name
    }
  },
  methods: {
    async verify() {
      let { verifyId } = this
      const { policyId, policyName, selectedFriends, hostOrgId: orgId, channel, useVerifyId } = this
      const { setFetching, startVerification, sendVerification, cleanModal } = this
      setFetching(true)
      if (!useVerifyId) {
        const verificationReq = await startVerification({
          policyId,
          policyName,
          hostOrgId: useVerifyId ? orgId : null
        })

        verifyId = verificationReq.id
      }

      let to,
        lastVerifyId,
        index = 1,
        totalFriends = selectedFriends.length

      for await (let friend of selectedFriends) {
        if (typeof friend === 'string') to = channel === 'sms' ? this.phone : friend
        else to = channel === 'email' ? friend.email : friend.phone

        const request = {
          to,
          verifyId,
          channel,
          policyName,
          moreToCome: index < totalFriends
        }

        if (lastVerifyId) {
          const verificationReq = await startVerification({
            policyId,
            policyName,
            hostOrgId: useVerifyId ? orgId : null
          })

          request.verifyId = verificationReq.id
        }

        await sendVerification(request)

        lastVerifyId = verifyId
        index++
      }

      cleanModal()
    },
    filter(item, searchText) {
      if (item.header) return false
      const { name, phone, email } = item
      const personDetails = `${name}${phone}${email}`.toLowerCase()
      searchText = searchText.toLowerCase()
      return personDetails.includes(searchText)
    },
    cleanModal() {
      this.selectedFriends = null
      this.index = -1
      this.policy = null
    },
    ...mapMutations({
      toggleSendVerificationModal: 'users/toggleSendVerificationModal',
      cacheVerifyId: 'ssi/cacheVerifyId',
      setFetching: 'setFetching'
    }),
    ...mapActions({
      sendVerification: 'ssi/sendVerification',
      startVerification: 'ssi/startVerification'
    })
  },

  watch: {
    showSendVerificationModal(show) {
      if (!show) {
        return this.cleanModal()
      } else {
        const { useVerifyId, verifyPolicy, verifySMSModalPresets, policies } = this
        if (useVerifyId) {
          this.policy = verifyPolicy
        } else if (verifySMSModalPresets) {
          const { contact, policyName } = verifySMSModalPresets
          if (contact) {
            this.selectedFriends = [contact]
          }
          if (policyName && policies) {
            this.policy = policies.find((p) => p.name === policyName)
          }
        }
      }
    },
    channel(channel) {
      if (channel === 'email') this.phone = ''
      if (channel === 'sms') this.email = ''
    },
    selectedFriends(friend) {
      if (!friend) {
        this.phone = ''
        this.email = ''
      }
      if (friend && typeof friend === 'string') {
        this.selectedFriends = {
          name: friend,
          email: friend,
          phone: friend
        }
      }
      if (friend && typeof friend === 'object') {
        this.phone = friend.phone
        this.email = friend.email
      }
    }
  }
}
</script>
