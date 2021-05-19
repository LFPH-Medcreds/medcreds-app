<template>
  <div class="asyncImage mb-5">
    <v-container fluid fill-height pt-0>
      <transition name="fade-transition">
        <v-col cols="12" justify="center" class="animated" v-show="show1">
          <v-row justify="center" class="mt-5 web" align-content="center">
            <v-col cols="10" sm="6" offset-sm="4" offset="2">
              <h1 class="display-7 mb-5 pt-5">Reset Your Password</h1>
            </v-col>
          </v-row>

          <v-row justify="center" class="mobile" align-content="start">
            <v-col cols="10" sm="6" offset-sm="2" offset="1">
              <h1 class="display-7">
                <center>Reset Your Password</center>
              </h1>
            </v-col>
          </v-row>

          <v-row justify="center" class="mt-5" align-content="start">
            <v-col cols="10" sm="6" offset-sm="2" offset="0">
              <form @submit.prevent="changePassword({ userId, password, confirmPassword, oldPassword, resetCode, router: $router })">
                <input type="hidden" name="username" v-model="email" />
                <v-row>
                  <v-col cols="12" sm="6" class="web pr-3">
                    <v-text-field
                      v-model="password"
                      type="password"
                      label="New Password"
                      name="password"
                      outlined
                      :append-icon="getPasswordIcon(password)"
                      autofocus
                    />
                  </v-col>
                  <v-col cols="12" sm="6" class="mobile">
                    <v-text-field
                      v-model="password"
                      type="password"
                      label="New Password"
                      name="password"
                      outlined
                      :append-icon="getPasswordIcon(password)"
                      autofocus
                    />
                  </v-col>
                  <v-col cols="12" sm="6" class="web pr-3">
                    <v-text-field
                      v-model="confirmPassword"
                      type="password"
                      label="Confirm Password"
                      name="confirmPassword"
                      outlined
                      :append-icon="getPassword2Icon(password, confirmPassword)"
                    />
                  </v-col>
                  <v-col cols="12" sm="6" class="mobile">
                    <v-text-field
                      v-model="confirmPassword"
                      type="password"
                      label="Confirm Password"
                      name="confirmPassword"
                      outlined
                      :append-icon="getPassword2Icon(password, confirmPassword)"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" class="web pr-3">
                    <v-text-field
                      v-if="!resetCode"
                      v-model="oldPassword"
                      type="password"
                      label="Old Password"
                      name="oldPassword"
                      outlined
                      :append-icon="getPasswordIcon(oldPassword)"
                      autofocus
                    />
                  </v-col>
                  <v-col cols="12" sm="6" class="mobile">
                    <v-text-field
                      v-if="!resetCode"
                      v-model="oldPassword"
                      type="password"
                      label="Old Password"
                      name="oldPassqword"
                      outlined
                      :append-icon="getPasswordIcon(oldPassword)"
                      autofocus
                    />
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

                <v-row>
                  <v-col cols="12">
                    <v-btn type="submit" block color="primary" :disabled="!formValid" :loading="fetching"> Change My Password </v-btn>
                  </v-col>
                </v-row>
              </form>
            </v-col>
          </v-row>
        </v-col>
      </transition>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import global from '@/mixins/global'

export default {
  transition: 'fade',
  layout: 'empty',
  mixins: [global],
  head() {
    return {
      title: 'Change Password'
    }
  },
  mounted() {
    let { secret } = this.$route.query
    if (secret) {
      this.resetCode = secret
      debugger
      this.email = atob(secret).split(':')[1]
      const query = {}
      this.$router.push({ query })
    } else {
      this.email = this.$session && this.$session.user && this.$session.user.email
    }
    this.userId = this.$session && this.$session.user && this.$session.user.id
  },
  data() {
    return {
      userId: null,
      email: '',
      resetCode: '',
      password: '',
      confirmPassword: '',
      oldPassword: ''
    }
  },
  computed: {
    ...mapGetters({
      deliveryError: 'users/deliveryError'
    }),

    formValid() {
      const { userId, email, password, confirmPassword, oldPassword, resetCode } = this
      return resetCode && password && confirmPassword && password === confirmPassword && password.length > 1 && confirmPassword.length > 1
    }
  },
  methods: {
    ...mapActions({
      changePassword: 'users/changePassword'
    })
  }
}
</script>
