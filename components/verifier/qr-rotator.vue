<template>
  <div>
    <div style="text-align: center">
      <div v-if="!verifyUrl" style="margin-top: 20px; text-align: center" key="fetching">
        <v-progress-circular indeterminate size="50" color="blue" />
        <div class="overline mt-3" id="generating-request">Generating request</div>
      </div>
    </div>
    <transition name="fade-transition">
      <v-col cols="12" sm="12" justify="center" class="animated pt-4" v-show="verifyUrl">
        <div key="fetching" style="text-align: center">
          <div class="overline">Please Scan to Provide Proof</div>
        </div>
      </v-col>
    </transition>

    <v-container fluid v-if="verifyUrl">
      <v-row>
        <v-col cols="12" align="center">
          <qrcode :value="verifyUrl" :options="{ width: 300, zIndex: 10 }" style="z-index: 999" />
        </v-col>
      </v-row>
      <v-row class="mb-5">
        <v-col cols="12" align="center">
          <v-btn color="gray" id="verifyUrl" class="overline" :href="verifyUrl" target="_blank">
            {{ verifyUrl }}
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" align="center">
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                v-bind="attrs"
                v-on="on"
                @click.stop="
                  setUseVerifyId(true)
                  toggleSendVerificationModal()
                "
                fab
              >
                <v-icon class="pa-5">mdi-share</v-icon>
              </v-btn>
            </template>

            Send the verification by email.
          </v-tooltip>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  methods: {
    ...mapMutations({
      toggleSendVerificationModal: 'users/toggleSendVerificationModal',
      setUseVerifyId: 'ssi/setUseVerifyId'
    })
  },
  props: {
    verifyUrl: {
      type: String,
      default: null
    }
  }
}
</script>
