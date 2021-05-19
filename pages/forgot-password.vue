<template>
  <v-fade-transition :hide-on-leave="true">
    <v-container v-show="!fetching && fadeInPage">
      <v-btn small class="mt-3" color="blue darken-1" text @click="$router.back()">
        <v-icon right dark> mdi-chevron-left </v-icon>
        Back
      </v-btn>
      <v-card flat>
        <v-card-title>
          <v-row>
            <v-col style="display: flex; justify-content: center">
              <v-img
                src="/proofmarket.svg"
                class="mr-3 mt-5"
                :style="{ 'max-width': $vuetify.breakpoint.smAndUp ? '25%' : '80%' }"
                contain
                eager
              />
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form @submit.prevent>
              <v-row>
                <v-col cols="12" sm="8" offset-sm="2">
                  <v-text-field
                    v-model="email"
                    label="Email"
                    ref="email"
                    outlined
                    autofocus
                    :append-icon="getEmailIcon(email)"
                    @keydown.enter="resetPassword({ email, router: $router })"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <div class="px-5">
          <v-row>
            <v-col cols="12" sm="8" offset-sm="2">
              <v-btn
                color="blue darken-1"
                style="color: white"
                id="send-reset-link"
                x-large
                block
                :loading="fetching"
                @click="resetPassword({ email, router: $router })"
                :disabled="!formValid || fetching"
              >
                Send me a password reset link
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </v-container>
  </v-fade-transition>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import global from '@/mixins/global'
import selectedOrgMixin from '@/mixins/selectedOrg'
import validator from 'validator'
import Logo from '@/components/logo'

export default {
  mixins: [selectedOrgMixin, global],
  layout: 'empty',
  components: {
    Logo
  },
  async mounted() {
    setTimeout(() => {
      this.fadeInPage = true
    }, 100)

    if (this.user && this.$route.path.includes('/login')) {
      await this.$router.push('/wallet')
    }
  },
  async fetch() {
    this.setFetching(true)
    const user = await this.checkLoginStatus()

    if (user && localStorage.currentRoute && !this.proposedVerificationRequest) {
      await this.$router.push(localStorage.currentRoute)
    } else if (user) {
      await this.$router.push('/wallet')
    }

    this.setFetching(false)
    this.$forceUpdate()
  },
  data() {
    return {
      email: null,
      reset: true,
      fadeInPage: false,
      logoProps: {
        'max-height': 170,
        'max-width': 140
      }
    }
  },
  computed: {
    ...mapGetters({
      proposedVerificationRequest: 'ssi/proposedVerificationRequest',
      fetching: 'fetching'
    }),

    formValid() {
      const { email } = this
      return email && validator.isEmail(email)
    }
  },
  methods: {
    ...mapMutations({
      setFetching: 'setFetching'
    }),
    ...mapActions({
      checkLoginStatus: 'users/checkLoginStatus',
      requestResetPassword: 'users/requestResetPassword'
    }),
    async resetPassword({ email, router: $router }) {
      try {
        const valid = this.email && validator.isEmail(this.email)
        if (!valid) throw 'Invalid!'
        await this.requestResetPassword({ email, router: $router })
      } catch (e) {
        console.warn(`Failed to request password reset, error was: '${e.message}'`)
      }
    }
  },
  watch: {
    reset(reset) {
      if (reset) this.$refs.email.focus()
    }
  }
}
</script>
