<template>
  <transition name="fade-transition">
    <v-container v-show="!fetching && fadeInPage && !clicked">
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
                @click="$router.push('/')"
              />
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-subtitle>
          <v-row style="margin-top: -0px" class="mt-5 mb-2">
            <v-col cols="12" sm="8" offset-sm="2">
              <span class="title" style="word-break: break-word; display: inline-block"> Enter the code sent to your phone: </span>
            </v-col>
          </v-row>
        </v-card-subtitle>
        <v-card-text>
          <v-container>
            <v-form>
              <v-row>
                <v-col cols="12" sm="8" offset-sm="2">
                  <v-text-field
                    v-model="code"
                    label="Code"
                    ref="code"
                    outlined
                    autofocus
                    :append-icon="get2FAIcon(code)"
                    @keypress.enter.prevent="
                      submit2fa({ code, router: $router })
                      clicked = 'login'
                    "
                    :disabled="fetching && !!clicked"
                  />
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
                id="submit2fa"
                block
                :loading="!user && fetching"
                @click.prevent="
                  submit2fa({ code, router: $router })
                  clicked = 'login'
                "
                :disabled="!formValid || (fetching && !!clicked)"
              >
                Submit
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </v-container>
  </transition>
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
    setTimeout(() => {
      this.fadeInPage = true
    }, 100)
  },

  async fetch() {},

  data() {
    return {
      fadeInPage: false,
      code: '',
      clicked: false,
      logoProps: {
        'max-height': 400
      }
    }
  },
  computed: {
    ...mapGetters({
      user: 'users/user',
      fetching: 'fetching',
      loginError: 'users/loginError'
    }),
    formValid() {
      const { code } = this
      return code && code.length > 4
    }
  },
  methods: {
    ...mapActions({
      submit2fa: 'users/submit2fa'
    })
  },
  watch: {
    loginError(error) {
      this.fadeInPage = true
      this.clicked = false
    }
  }
}
</script>
