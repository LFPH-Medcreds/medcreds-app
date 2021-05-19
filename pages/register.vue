<template>
  <v-fade-transition :hide-on-leave="true">
    <v-container v-show="!fetching && !user && fadeInPage" class="animated" style="height: 100vh; display: flex; flex-wrap: wrap">
      <v-btn small class="mt-3" color="blue darken-1" text @click="$router.back()">
        <v-icon right dark> mdi-chevron-left </v-icon>
        Back
      </v-btn>
      <v-card
        flat
        :style="{
          'height': $vuetify.breakpoint.smAndUp ? '100%' : '40%',
          'width': $vuetify.breakpoint.smAndUp ? '40%' : '100%',
          'display': 'flex'
        }"
      >
        <v-container
          :style="{
            'height': $vuetify.breakpoint.smAndUp ? '78%' : '25rem',
            'background-image': 'url(\'/svg/register.svg\')',
            'object-fit': 'cover',
            'align-self': $vuetify.breakpoint.smAndUp ? 'center' : 'flex-start',
            'margin-left': $vuetify.breakpoint.smAndUp ? 0 : '10%'
          }"
        >
        </v-container>
      </v-card>
      <v-card
        flat
        :style="{
          'width': $vuetify.breakpoint.smAndUp ? '50%' : '100%',
          'align-self': $vuetify.breakpoint.smAndUp ? 'center' : 'flex-start'
        }"
      >
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
        <v-card-text class="py-0">
          <v-container>
            <v-row>
              <v-col cols="12" sm="8" offset-sm="2">
                <v-text-field
                  v-model="name"
                  label="Legal Name"
                  outlined
                  autofocus
                  :append-icon="getFullNameIcon(name)"
                  placeholder="Input your full legal name"
                />
              </v-col>
              <v-col cols="12" sm="8" offset-sm="2">
                <v-text-field v-model="email" autocomplete="false" label="Email" outlined :append-icon="getEmailIcon(email)" />
              </v-col>
              <v-col cols="12" sm="8" offset-sm="2">
                <PhoneInput v-model="phone" placeholder="Enter your phone number" />
              </v-col>
              <v-col cols="12" sm="8" offset-sm="2">
                <v-text-field
                  v-model="password"
                  autocomplete="false"
                  label="Password"
                  type="password"
                  outlined
                  @keypress.enter="register({ email, phone, password, name, inviteCode, router: $router })"
                  :append-icon="getPasswordIcon(password)"
                />
              </v-col>
              <v-col cols="12" sm="8" offset-sm="2">
                <v-text-field
                  v-model="password2"
                  autocomplete="false"
                  label="Repeat Password"
                  type="password"
                  outlined
                  @keypress.enter="register({ email, phone, password, name, inviteCode, router: $router })"
                  :append-icon="getPassword2Icon(password, password2)"
                />
              </v-col>
              <v-col cols="12" sm="8" offset-sm="2">
                <v-checkbox v-model="acceptTap" id="agree-terms-privacy" outlined>
                  <template v-slot:label>
                    <span style="display: block">
                      I certify that I have read and accept the
                      <a href="https://www.proofmarket.io/terms" @click.stop target="_blank">Terms of Service</a>
                      and
                      <a href="https://www.proofmarket.io/privacy" @click.stop target="_blank">Privacy Policy</a>.
                    </span>
                  </template>
                </v-checkbox>
              </v-col>
            </v-row>
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
          </v-container>
        </v-card-text>
        <div class="px-5">
          <v-row>
            <v-col cols="12" sm="8" offset-sm="2">
              <v-btn
                color="blue darken-1"
                class="my-5"
                style="color: white"
                x-large
                id="register"
                block
                @click="register({ email, password, phone, name, inviteCode, router: $router })"
                :disabled="!formValid"
                :loading="fetching"
              >
                Register
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </v-container>
  </v-fade-transition>
</template>

<style scoped>
.ellipsis-anim span {
  opacity: 0;
  -webkit-animation: ellipsis-dot 1s infinite;
  animation: ellipsis-dot 1s infinite;
}

.ellipsis-anim span:nth-child(1) {
  -webkit-animation-delay: 0s;
  animation-delay: 0s;
}
.ellipsis-anim span:nth-child(2) {
  -webkit-animation-delay: 0.1s;
  animation-delay: 0.1s;
}
.ellipsis-anim span:nth-child(3) {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}

@-webkit-keyframes ellipsis-dot {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes ellipsis-dot {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import PhoneInput from '@/components/phone-input'
import global from '@/mixins/global'
import selectedOrgMixin from '@/mixins/selectedOrg'
import Logo from '@/components/logo'
import validator from 'validator'

export default {
  mixins: [selectedOrgMixin, global],

  layout: 'empty',

  components: {
    PhoneInput,
    Logo
  },

  mounted() {
    setTimeout(() => {
      this.fadeInPage = true
    }, 100)
    const { secret } = this.$route.query
    if (secret) {
      this.inviteCode = secret
      let query = { ...this.$route.query }
      delete query.secret
      this.$router.push({ query })
    }
  },

  data() {
    return {
      name: null,
      email: null,
      phone: null,
      password: null,
      password2: null,
      acceptTap: false,
      inviteCode: null,
      fadeInPage: false
    }
  },

  computed: {
    ...mapGetters({
      fetching: 'fetching',
      loginError: 'users/loginError',
      user: 'users/user'
    }),

    formValid() {
      const { email, password, phone, name, password2, acceptTap, getFullNameIcon } = this
      return (
        getFullNameIcon(name) === 'mdi-check' &&
        phone &&
        email &&
        validator.isEmail(email) &&
        acceptTap &&
        password &&
        password2 &&
        password === password2 &&
        password.length > 1
      )
    }
  },

  methods: {
    ...mapActions({
      register: 'users/register'
    })
  }
}
</script>
