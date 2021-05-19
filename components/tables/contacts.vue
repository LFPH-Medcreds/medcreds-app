<template>
  <transition-group name="fade">
    <v-card id="contacts-table" key="contacts-table" :class="{ 'ma-5': !$vuetify.breakpoint.xsOnly }">
      <v-toolbar color="blue" dark :class="{ 'mt-5': $vuetify.breakpoint.smAndUp }">
        <v-toolbar-title style="white-space: unset !important">
          <div class="pt-3 mb-3 web">Contacts</div>
          <div class="pt-3 mb-3 mobile subtitle-1">Contacts</div>
        </v-toolbar-title>

        <v-spacer />

        <IconButton tool-tip="Add new contact" id="add-contact" icon="mdi-account-multiple-plus" @click="toggleInviteFriendModal()" />

        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details />
      </v-toolbar>

      <v-data-table
        :headers="headers"
        :items="user.friends"
        must-sort
        sort-by="name"
        :sort-desc="false"
        flat
        :show-expand="false"
        item-key="email"
        :search="search"
        :footer-props="{ 'items-per-page-options': [20, 50, -1] }"
        class="pa-1"
      >
        <template v-slot:item="{ item: contact, index: i, expand, isExpanded, isSelected, select }">
          <tr v-if="$vuetify.breakpoint.xsOnly">
            <td>
              <v-list dense flat>
                <v-list-item dense append>
                  <v-list-item-title>{{ contact.name }}</v-list-item-title>
                  <v-btn small text color="primary" @click.stop="requestTempVerification(contact)">
                    <v-icon> mdi-thermometer </v-icon>
                    Temp
                  </v-btn>
                  <v-btn small text color="primary" @click.stop="requestSelfCheckVerification(contact)">
                    <v-icon> mdi-account-check </v-icon>
                    Health
                  </v-btn>

                  <v-btn small text color="primary" @click.stop="requestMedicalTestVerification(contact)">
                    <v-icon> mdi-qrcode-plus </v-icon>
                    Test
                  </v-btn>
                </v-list-item>
              </v-list>
            </td>
          </tr>
          <tr v-else>
            <td>
              {{ contact.name }}
            </td>

            <td>
              {{ contact.email }}
            </td>

            <td>
              {{ contact.phone }}
            </td>

            <td>
              <div style="text-align: center">
                <v-btn small text color="primary" @click.stop="requestTempVerification(contact)">
                  <v-icon> mdi-thermometer </v-icon>
                  Temp
                </v-btn>

                <v-btn small text color="primary" @click.stop="requestSelfCheckVerification(contact)">
                  <v-icon> mdi-account-check </v-icon>
                  Health
                </v-btn>

                <v-btn small text color="primary" @click.stop="requestMedicalTestVerification(contact)">
                  <v-icon> mdi-qrcode-plus </v-icon>
                  Test
                </v-btn>
              </div>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </transition-group>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import global from '@/mixins/global'
import IconButton from '@/components/icon-button'

export default {
  mixins: [global],
  components: {
    IconButton
  },
  data() {
    return {
      search: '',
      headers: [
        { text: 'Name', align: 'left', value: 'name' },
        { text: 'Email', align: 'left', value: 'email' },
        { text: 'Phone', align: 'left', value: 'phone' },
        { text: 'Assess', align: 'center' }
      ]
    }
  },

  mounted() {
    this.getMe()
  },

  computed: {
    ...mapGetters({
      fetching: 'fetching'
    })
  },

  methods: {
    ...mapActions({
      getMe: 'users/getMe'
    }),
    ...mapMutations({
      toggleInviteFriendModal: 'users/toggleInviteFriendModal',
      toggleSendVerificationModal: 'users/toggleSendVerificationModal',
      setActivePatient: 'users/setActivePatient'
    }),

    requestTempVerification(contact) {
      this.toggleSendVerificationModal({ contact, policyName: 'Proof of Temperature' })
    },

    requestSelfCheckVerification(contact) {
      this.toggleSendVerificationModal({ contact, policyName: 'Proof of Self Check' })
    },

    requestMedicalTestVerification(contact) {
      this.toggleSendVerificationModal({ contact, policyName: 'Proof of Test Result' })
    }
  }
}
</script>
