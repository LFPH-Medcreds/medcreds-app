<template>
  <v-fade-transition v-if="!fetching" :hide-on-leave="true">
    <v-container style="height: 100vh; display: flex; flex-wrap: wrap">
      <v-card flat :style="{ 'width': $vuetify.breakpoint.smAndUp ? '50%' : '100%', 'align-self': 'center' }">
        <v-card-title>
          <v-row style="display: flex; justify-content: center; margin: 3rem 12%">
            <v-subheader style="word-break: keep-all !important">
              Peace of Mind with MedCreds by ProofMarket is a private and secure digital health wallet. Only you have access to your
              MedCreds and only you control who to share your MedCreds with.
            </v-subheader>
          </v-row>
          <v-row>
            <v-col style="display: flex; justify-content: center">
              <v-img
                src="/proofmarket.svg"
                class="mr-3 mt-5"
                :style="{ 'max-width': $vuetify.breakpoint.smAndUp ? '45%' : '80%' }"
                contain
                eager
              />
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form>
              <v-row>
                <v-col cols="12" sm="8" offset-sm="2">
                  <v-text-field v-model="email" label="Email" ref="email" outlined autofocus :append-icon="getEmailIcon(email)" />
                </v-col>
                <v-col cols="12" sm="8" offset-sm="2">
                  <v-text-field
                    v-show="!reset"
                    v-model="password"
                    autocomplete="false"
                    label="Password"
                    type="password"
                    outlined
                    @keypress.enter="login({ email, password, router: $router })"
                    :append-icon="getNameIcon(password)"
                  />
                </v-col>
              </v-row>
              <center v-if="proposedVerificationRequest" class="subtitle-1">Login to see your verification request.</center>
              <transition name="fade-transition">
                <v-row v-show="loginError.length">
                  <v-col>
                    <span class="red--text subheading">
                      <center>
                        {{ loginError }}
                      </center>
                    </span>
                  </v-col>
                </v-row>
              </transition>
            </v-form>
          </v-container>
        </v-card-text>
        <div class="px-5">
          <v-row>
            <v-col cols="12" sm="8" offset-sm="2">
              <v-btn
                color="blue darken-1"
                style="color: white"
                x-large
                id="login"
                block
                :loading="!user && fetching"
                @click="login({ email, password, router: $router })"
                :disabled="!formValid || fetching"
              >
                Login
              </v-btn>
            </v-col>

            <v-col cols="12" sm="8" offset-sm="2" class="my-4" :style="responsiveCtaButtons">
              <v-btn id="register-new-account" class="mt-3 mr-n4" color="blue darken-1" text @click="navigateToRegistration()">
                <div style="display: flex; flex-direction: column">
                  <div>Don't have an account?</div>
                  <div>Register for one here</div>
                </div>
              </v-btn>
              <v-btn id="forgot-password" class="mt-3 mr-n4" color="blue darken-1" text @click="forgotPassword({ router: $router })">
                Forgot Password
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-card>
      <v-card flat :style="{ 'height': '100%', 'width': $vuetify.breakpoint.smAndUp ? '50%' : '100%', 'display': 'flex' }">
        <v-container
          :style="{
            'height': $vuetify.breakpoint.smAndUp ? '78%' : '25rem',
            'background-image': 'url(\'/svg/login.svg\')',
            'object-fit': 'cover',
            'align-self': $vuetify.breakpoint.smAndUp ? 'center' : 'flex-start',
            'margin-left': $vuetify.breakpoint.smAndUp ? 0 : '10%'
          }"
        >
        </v-container>
      </v-card>
    </v-container>
  </v-fade-transition>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import global from '@/mixins/global'
import selectedOrgMixin from '@/mixins/selectedOrg'
import Logo from '@/components/logo'

export default {
  mixins: [selectedOrgMixin, global],
  layout: 'empty',
  components: {
    Logo
  },

  async mounted() {
    const user = await this.checkLoginStatus()

    if (user && localStorage.currentRoute && !this.proposedVerificationRequest) {
      await this.$router.push(localStorage.currentRoute)
    } else if (user) {
      await this.$router.push('/wallet')
    } else {
      await this.$router.push('/login')
    }
  },

  data() {
    return {
      email: null,
      password: null,
      reset: false,
      code: null,
      logoProps: {
        'max-width': 400
      }
    }
  },

  computed: {
    ...mapGetters({
      user: 'users/user',
      fetching: 'fetching',
      loginError: 'users/loginError',
      proposedVerificationRequest: 'ssi/proposedVerificationRequest'
    }),
    formValid() {
      const { email, password } = this
      return email && email.match(/^\S+@\S+\.\S+$/) && password && password.length > 1
    },
    responsiveCtaButtons() {
      let styles = { display: 'flex' }
      if (this.$vuetify.breakpoint.smAndUp) styles = { ...styles, 'justify-content': 'space-between' }
      else styles = { ...styles, 'flex-direction': 'column' }
      return styles
    }
  },
  methods: {
    ...mapMutations({
      setFetching: 'setFetching'
    }),
    ...mapActions({
      login: 'users/login',
      checkLoginStatus: 'users/checkLoginStatus'
    }),
    forgotPassword({ router: $router }) {
      this.$router.push('/forgot-password')
    },
    navigateToRegistration() {
      this.$router.push('/register')
    }
  },
  watch: {
    user() {
      if (this.proposedVerificationRequest) this.$router.push('/wallet')
      if (this.user && this.$route.path.includes('/login')) this.$router.push('/wallet')
    }
  }
}
</script>
