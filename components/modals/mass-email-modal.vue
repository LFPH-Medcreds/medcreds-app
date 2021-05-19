<template>
  <v-dialog
    v-model="showMassEmailModal"
    persistent
    max-width="800px"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    @click:outside="toggleMassEmailModal()"
  >
    <v-card class="py-1">
      <v-card-title>
        <Logo :title="`Email User${selected.length > 1 ? `s` : ''}`" :modalTitle="true" />
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="10" offset-sm="1">
              <v-select multiple v-model="selected" chips :items="selected" label="Notify Users" disabled>
                <template v-slot:selection="{ item }">
                  <v-chip>{{ `${item.name}` }}</v-chip>
                </template>
              </v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="10" offset-sm="1">
              <v-text-field outlined label="Subject" v-model="subject" autofocus />
              <!-- <v-text-field v-model="to" label="Email" type="email" placeholder="awesome@user.com" @keypress.enter="email({ to })" outlined autofocus :append-icon="getEmailIcon(to)" /> -->
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" sm="10" offset-sm="1">
              <v-textarea outlined label="Message" v-model="message" />
              <!-- <v-text-field v-model="to" label="Email" type="email" placeholder="awesome@user.com" @keypress.enter="email({ to })" outlined autofocus :append-icon="getEmailIcon(to)" /> -->
            </v-col>
          </v-row>

          <transition name="fade-transition">
            <v-row v-show="deliveryError.length">
              <v-col>
                <span class="red--text subheading">
                  <center>
                    {{ deliveryError }}
                  </center>
                </span>
              </v-col>
            </v-row>
          </transition>
        </v-container>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="toggleMassEmailModal()"> Close </v-btn>
        <v-btn
          color="primary"
          @click="
            sendMassEmail({ users: selected, subject, message, hostOrgId })
            index = 'send'
          "
          :disabled="!formValid || (fetching && index == 'send')"
          :loading="fetching && index == 'send'"
        >
          Send Email
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import global from '@/mixins/global'
import selectedOrgMixin from '@/mixins/selectedOrg'
import Logo from '@/components/logo'

export default {
  mixins: [global, selectedOrgMixin],
  props: {
    selected: Array
  },
  components: {
    Logo
  },
  data() {
    return {
      index: -1,
      subject: '',
      message: ''
    }
  },
  computed: {
    ...mapGetters({
      showMassEmailModal: 'users/showMassEmailModal',
      user: 'users/user',
      fetching: 'fetching',
      deliveryError: 'users/deliveryError'
    }),
    formValid() {
      const { subject, message, selected } = this
      return subject && message && selected && subject.length && message.length && selected.length
    }
  },
  methods: {
    ...mapMutations({
      toggleMassEmailModal: 'users/toggleMassEmailModal'
    }),
    ...mapActions({
      sendMassEmail: 'users/sendMassEmail'
    })
  },
  watch: {
    showMassEmailModal() {
      if (!this.showMassEmailModal) {
        this.subject = null
        this.message = null
      }
    }
  }
}
</script>
