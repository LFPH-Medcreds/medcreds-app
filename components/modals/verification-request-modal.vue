<template>
  <v-dialog
    id="verification-preload-modal"
    v-model="pendingRequest"
    v-if="pendingRequest"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    :max-width="calculatedMaxWidth"
    persistent
    class="animated"
    style="overflow-x: hidden"
  >
    <v-card
      v-if="!wallet || !pendingRequest.state || pendingRequest.state === 'Loading'"
      min-height="250"
      :loading="true"
      style="overflow-x: hidden"
    >
      <div style="padding-top: 50px; padding-bottom: 20px; text-align: center" class="overline">Fetching Verification Request</div>
      <v-card-text>
        <div style="text-align: center">
          <Logo :standalone="true" v-bind="logoProps" />
        </div>
      </v-card-text>
    </v-card>

    <v-card v-else-if="selfAssessingPolicyName === 'Proof of Self Check'">
      <IssueSelfCheckCredential :key="pendingRequest.id" @submit="submittedCredential" />
    </v-card>

    <v-card v-else-if="selfAssessingPolicyName === 'Proof of Temperature'">
      <IssueTempCredential :key="pendingRequest.id" @submit="submittedCredential" />
    </v-card>

    <v-card
      v-else-if="!pendingRequest.credential || pendingRequest.state === 'Accepted' || pendingRequest.state === 'Failed'"
      color="white"
      class="pa-5"
    >
      <transition-group name="fade-transition">
        <v-card-title key="title" class="my-0 py-0">
          <Logo
            :title="canSelfAssess ? 'Self Assessment Required' : 'Assessment Required'"
            :titleResponsive="canSelfAssess ? 'Self Assessment Required' : 'Assessment Required'"
            :modalTitle="true"
          />
        </v-card-title>

        <v-card-text class="mt-n2" key="subtitle">
          <div v-if="pendingRequest.state === 'Accepted' || pendingRequest.state === 'Failed'" class="red--text mt-3 subtitle-1">
            <div :style="{ 'height': '20rem', 'margin-top': $vuetify.breakpoint.smAndUp ? '1rem' : '40%' }">
              <v-container
                :style="{
                  'height': '100%',
                  'background-image': 'url(\'/svg/preload-verification.svg\')',
                  'background-position': 'center',
                  'object-fit': 'cover'
                }"
              >
              </v-container>
            </div>
            <h1 class="headline my-3" style="color: #eba236; font-weight: 900; text-align: center">
              <span v-if="pendingRequest.policyName">
                Looks like you, or someone else, already accepted this request for {{ pendingRequest.policyName }}.
              </span>
              <span v-else> Looks like or someone else already accepted this request.</span>
            </h1>
            <div style="text-align: center"></div>
          </div>
          <div v-else>
            <div :style="{ 'height': '20rem', 'margin-top': $vuetify.breakpoint.smAndUp ? '1rem' : '40%' }">
              <v-container
                :style="{
                  'height': '100%',
                  'background-image': 'url(\'/svg/preload-verification.svg\')',
                  'background-position': 'center',
                  'object-fit': 'cover'
                }"
              >
              </v-container>
            </div>
            <div style="display: flex; flex-direction: column; justify-content: center; padding: 1rem">
              <h1 class="headline my-3" style="color: #eba236; font-weight: 900; text-align: center">
                Uh-oh, it seems that you do not have a {{ pendingRequest.policyName }}
              </h1>
              <div v-if="canSelfAssess" style="display: flex; flex-direction: column">
                <v-btn color="primary" dark block class="mb-2" @click="proceedToSelfAssess()" id="create-credential">Create one now</v-btn>
              </div>
              <div v-if="!canSelfAssess" style="display: flex; flex-direction: column">
                <h3 class="my-3" style="color: #eba236; font-weight: 900; text-align: center">
                  You need to get in touch with your GP or a testing lab to get tested.
                </h3>
              </div>
            </div>
          </div>

          <v-btn color="secondary" dark block class="mb-2" @click="clearProposedVerificationRequest()" id="dismiss-invalid">
            Dismiss
          </v-btn>
        </v-card-text>
      </transition-group>
    </v-card>

    <v-card v-else color="white" class="pa-5" id="verify-modal-loaded">
      <transition-group name="fade-transition">
        <v-card-title key="title" class="my-0 py-0">
          <Logo title="Credential Request" titleResponsive="Credential Request" :modalTitle="true" />
          <v-spacer />
        </v-card-title>

        <v-card-text key="text">
          <v-container>
            <v-row justify="center">
              <v-col cols="12" sm="9" class="mb-5">
                <div class="subtitle-1">
                  <p>
                    Do you consent to provide <strong>{{ pendingRequest.verifierName }}</strong> of
                    <strong>{{ pendingRequest.orgName }}</strong> with the following information?
                  </p>

                  <p style="font-size: small; line-height: 1.4">
                    Your consent is limited to this one-time verification, your data may not be used for any other purpose unless such use
                    is specifically authorized by you.
                  </p>
                </div>

                <v-divider></v-divider>

                <CertifiedTestResult
                  :credential="pendingRequest.credential"
                  :outdated="pendingRequest.outdatedCredential"
                  v-if="pendingRequest.schema === 'Certified Test Result:3.0'"
                />

                <CertifiedTemperature
                  :credential="pendingRequest.credential"
                  :outdated="pendingRequest.outdatedCredential"
                  v-if="pendingRequest.schema === 'Certified Temperature:1.0'"
                />

                <CertifiedSelfCheck
                  :credential="pendingRequest.credential"
                  :outdated="pendingRequest.outdatedCredential"
                  v-if="pendingRequest.schema === 'Certified Self Check:1.1'"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <div style="text-align: center">
                  <v-btn
                    id="consent"
                    class="mr-1 mb-2"
                    :loading="accepting"
                    color="primary"
                    block
                    @click="acceptVerificationRequest()"
                    :disabled="accepting || accepted"
                    min-width="150px"
                  >
                    Consent
                  </v-btn>
                  <v-btn
                    v-if="pendingRequest.outdatedCredential && canSelfAssess"
                    id="renew"
                    class="mr-1 mb-2"
                    color="primary"
                    block
                    @click="proceedToSelfAssess()"
                    :disabled="accepting || accepted"
                    min-width="150px"
                  >
                    <span> Renew </span>
                  </v-btn>
                  <v-btn
                    id="dismiss"
                    class="mr-1 mb-2"
                    :disabled="accepting || accepted"
                    color="secondary"
                    block
                    @click="clearProposedVerificationRequest()"
                    min-width="150px"
                  >
                    <span> Dismiss </span>
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </transition-group>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import global from '@/mixins/global'
import Logo from '@/components/logo'
import IssueSelfCheckCredential from '../issue/issue-self-check-credential'
import IssueTempCredential from '../issue/issue-temp-credential'
import CertifiedTestResult from '@/components/creds/CertifiedTestResult'
import CertifiedTemperature from '@/components/creds/CertifiedTemperature'
import CertifiedSelfCheck from '@/components/creds/CertifiedSelfCheck'

export default {
  mixins: [global],

  data() {
    return {
      selfAssessingPolicyName: null,
      accepting: false,
      accepted: false,
      logoProps: {
        'max-height': 80,
        height: 80
      }
    }
  },

  components: {
    CertifiedTestResult,
    CertifiedTemperature,
    CertifiedSelfCheck,
    IssueSelfCheckCredential,
    IssueTempCredential,
    Logo
  },

  computed: {
    ...mapGetters({
      user: 'users/user',
      wallet: 'users/wallet',
      pendingRequest: 'ssi/proposedVerificationRequest'
    }),

    canSelfAssess() {
      const { pendingRequest } = this
      return pendingRequest.policyName === 'Proof of Self Check' || pendingRequest.policyName === 'Proof of Temperature'
    },

    calculatedMaxWidth() {
      const { selfAssessingPolicyName, pendingRequest } = this
      const state = pendingRequest && pendingRequest.state

      if (selfAssessingPolicyName === 'Proof of Self Check') {
        return 800
      } else if (selfAssessingPolicyName === 'Proof of Temperature') {
        return 300
      } else if (state === 'Loading' || !state) {
        return 300
      } else {
        return 500
      }
    }
  },

  mounted() {
    this.triggerLoadIfNeeded()
  },

  methods: {
    ...mapMutations({
      clearProposedVerificationRequest: 'ssi/clearProposedVerificationRequest'
    }),

    ...mapActions({
      grabProposedVerificationRequest: 'ssi/grabProposedVerificationRequest',
      completeVerification: 'ssi/completeVerification'
    }),

    proceedToSelfAssess() {
      this.selfAssessingPolicyName = this.pendingRequest.policyName
    },

    async acceptVerificationRequest() {
      const { wallet, pendingRequest } = this
      this.accepting = true
      try {
        await this.completeVerification({ verifyId: pendingRequest.id, walletId: wallet.walletId })
        this.accepted = true

        // the request is kaput!
        this.clearProposedVerificationRequest()
      } catch (e) {
        console.error('Failed to accept verification request.', e)
      }

      this.accepting = false
    },

    submittedCredential(success) {
      this.selfAssessingPolicyName = null
      if (success) {
        this.grabProposedVerificationRequest({ id: this.pendingRequest.id, reload: true })
      }
    },

    triggerLoadIfNeeded() {
      const { pendingRequest } = this
      if (pendingRequest && !pendingRequest.state) {
        this.grabProposedVerificationRequest({ id: this.pendingRequest.id, load: true })
      }
    }
  },

  watch: {
    pendingRequest() {
      this.triggerLoadIfNeeded()
    }
  }
}
</script>
