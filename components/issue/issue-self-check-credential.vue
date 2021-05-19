<template>
  <v-stepper v-model="step" @change="fadeInStepButtons()" class="no-transition">
    <v-stepper-header>
      <v-stepper-step :complete="step > 1" editable step="1">Recent Symptoms</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="step > 2" editable step="2">Emergency Warning Signs</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="step > 3" editable step="3">Recent Exposure</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="4">Test Recommendation</v-stepper-step>
      <v-progress-linear v-if="submitting || submitted" indeterminate color="blue" />
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <v-card class="elevation-0" id="self-check-page-1">
          <v-card-text :class="{ 'mt-n5': $vuetify.breakpoint.smAndDown }">
            <h3 v-if="$vuetify.breakpoint.smAndDown">
              {{ forOther ? 'Does the patient show any of the following symptoms?' : 'Do you have any of the following symptoms?' }}
            </h3>
            <h1 v-else>
              {{ forOther ? 'Does the patient show any of the following symptoms?' : 'Do you have any of the following symptoms?' }}
            </h1>

            <v-list class="pa-0 ml-n5" :dense="$vuetify.breakpoint.smAndDown">
              <v-list-item class="pa-0 ma-0 wrap-text" v-for="symptom in symptoms1" :key="symptom">
                <v-list-item-avatar>
                  <v-icon color="blue"> mdi-checkbox-blank-circle </v-icon>
                </v-list-item-avatar>
                <v-list-item-content class="wrap-text">
                  <v-list-item-title class="wrap-text">
                    {{ symptom }} <span v-if="symptom === 'Fever'">above 100.4 &#8457; / 38.0 &#8451;, or chills</span>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <h4 v-if="$vuetify.breakpoint.smAndDown">
              {{
                forOther
                  ? ''
                  : 'This list is not all inclusive. Please consult your medical provider for any other symptoms that are severe or concerning'
              }}
            </h4>
            <h4 v-else class="my-3">
              {{
                forOther
                  ? ''
                  : 'This list is not all inclusive. Please consult your medical provider for any other symptoms that are severe or concerning'
              }}
            </h4>
          </v-card-text>

          <div :class="{ 'tall-action-buttons': $vuetify.breakpoint.smAndDown }" class="pb-5">
            <div style="text-align: right">
              <v-btn color="secondary" @click="cancelSubmit()"> Close </v-btn>
              <v-btn color="primary" @click="setNewSymptoms({ newSymptoms: true })"> Yes </v-btn>
              <v-btn color="primary" @click="setNewSymptoms({ newSymptoms: false })"> No </v-btn>
            </div>
          </div>
        </v-card>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-card class="elevation-0" id="self-check-page-2">
          <v-card-text :class="{ 'mt-n5': $vuetify.breakpoint.smAndDown }">
            <div v-if="$vuetify.breakpoint.smAndDown">
              <h3>COVID-19 Emergency Warning Signs</h3>
              <h4>
                {{
                  forOther
                    ? 'Does the patient have any of the following symptoms:'
                    : 'Do you have any any of the following symptoms? If so, please seek immediate medical help.'
                }}
              </h4>
            </div>
            <div v-else>
              <h1>COVID-19 Emergency Warning Signs</h1>
              <h3>
                {{
                  forOther
                    ? 'Does the patient have any of the following symptoms:'
                    : 'Do you have any any of the following symptoms? If so, please seek immediate medical help.'
                }}
              </h3>
            </div>

            <v-list class="pa-0 ml-n5" :dense="$vuetify.breakpoint.smAndDown">
              <v-list-item class="pa-0" v-for="symptom in symptoms2" :key="symptom">
                <v-list-item-avatar>
                  <v-icon color="blue"> mdi-checkbox-blank-circle </v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="wrap-text">
                    {{ symptom }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <h4 v-if="$vuetify.breakpoint.smAndDown">
              {{
                forOther
                  ? ''
                  : 'This list is not all inclusive. Please consult your medical provider for any other symptoms that are severe or concerning'
              }}
            </h4>
            <h4 v-else class="my-3">
              {{
                forOther
                  ? ''
                  : 'This list is not all inclusive. Please consult your medical provider for any other symptoms that are severe or concerning'
              }}
            </h4>
          </v-card-text>
          <div :class="{ 'tall-action-buttons': $vuetify.breakpoint.smAndDown }" class="pb-5">
            <div style="text-align: right">
              <v-btn color="secondary" @click="cancelSubmit()"> Close </v-btn>
              <v-btn color="primary" @click="setEmergencySymptoms({ emergencySymptoms: true })"> Yes </v-btn>
              <v-btn color="primary" @click="setEmergencySymptoms({ emergencySymptoms: false })"> No </v-btn>
            </div>
          </div>
        </v-card>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-card class="elevation-0" id="self-check-page-3">
          <v-card-text :class="{ 'mt-n5': $vuetify.breakpoint.smAndDown }">
            <div v-if="$vuetify.breakpoint.smAndDown">
              <h3>Recent Exposure</h3>
              <h4>
                {{ forOther ? '' : 'Do any of these apply to you?' }}
              </h4>
            </div>
            <div v-else>
              <h1>Recent Exposure</h1>
              <h3>
                {{ forOther ? '' : 'Do any of these apply to you?' }}
              </h3>
            </div>
            <v-list class="pa-0 ml-n5" :dense="$vuetify.breakpoint.smAndDown">
              <v-list-item class="pa-0" v-for="exposure in exposures" :key="exposure">
                <v-list-item-avatar>
                  <v-icon color="blue"> mdi-checkbox-blank-circle </v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="wrap-text">
                    {{ exposure }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <h4 v-if="$vuetify.breakpoint.smAndDown">
              {{
                forOther
                  ? ''
                  : 'This list is not all inclusive. Please consult your medical provider for any other symptoms that are severe or concerning'
              }}
            </h4>
            <h4 v-else class="my-3">
              {{
                forOther
                  ? ''
                  : 'This list is not all inclusive. Please consult your medical provider for any other symptoms that are severe or concerning'
              }}
            </h4>
          </v-card-text>
          <div :class="{ 'tall-action-buttons': $vuetify.breakpoint.smAndDown }" class="pb-5">
            <div style="text-align: right">
              <v-btn color="secondary" @click="cancelSubmit()"> Close </v-btn>
              <v-btn color="primary" @click="setCloseProximity({ closeProximity: true })"> Yes </v-btn>
              <v-btn color="primary" @click="setCloseProximity({ closeProximity: false })"> No </v-btn>
            </div>
          </div>
        </v-card>
      </v-stepper-content>

      <v-stepper-content step="4">
        <v-card class="elevation-0" id="self-check-page-4">
          <v-card-text :class="{ 'mt-n5': $vuetify.breakpoint.smAndDown }">
            <div v-if="!submitted && !submitting">
              <h3 v-if="$vuetify.breakpoint.smAndDown">Test Recommendation</h3>
              <h1 v-else>Test Recommendation</h1>
              <h4 class="subtitle-1" v-if="$vuetify.breakpoint.smAndDown">Has a medical professional recommended you get tested?</h4>
              <h3 class="subtitle-1" v-else>Has a medical professional recommended you get tested?</h3>
            </div>
            <div v-else>
              <div class="pa-5" style="text-align: center">
                <h4 v-if="$vuetify.breakpoint.smAndDown">
                  {{ forOther ? 'Certifying Health Check' : 'Certifying Self Health Check' }}
                </h4>
                <h1 v-else>
                  {{ forOther ? 'Certifying Health Check' : 'Certifying Self Health Check' }}
                </h1>
              </div>
            </div>
          </v-card-text>

          <div :class="{ 'tall-action-buttons': $vuetify.breakpoint.smAndDown }" class="pb-5">
            <div style="text-align: right">
              <v-btn color="secondary" :disabled="submitting" @click="cancelSubmit()"> Close </v-btn>
              <v-btn color="primary" :disabled="submitting || submitted" @click="submit({ testAdvised: true })"> Yes </v-btn>
              <v-btn color="primary" :disabled="submitting || submitted" @click="submit({ testAdvised: false })"> No </v-btn>
            </div>
          </div>
        </v-card>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import { mapActions } from 'vuex'
import global from '@/mixins/global'
import selectedOrgMixin from '@/mixins/selectedOrg'

export default {
  mixins: [global, selectedOrgMixin],
  props: {
    forOther: Boolean,
    email: String
  },
  data() {
    return {
      step: 1,
      stepped: true,
      closeProximity: null,
      newSymptoms: null,
      emergencySymptoms: null,
      testAdvised: null,
      submitting: false,
      submitted: false,
      symptoms1: [
        'Fever',
        'Cough or sore throat',
        'Headache',
        'Shortness of breath or difficulty breathing',
        'Fatigue, muscle aches, or body aches',
        'Loss of taste or smell',
        'Runny nose or congestion',
        'Nausea, vomiting, or diarrhea'
      ],
      symptoms2: [
        'Trouble breathing',
        'Persistent pain or pressure in the chest',
        'New confusion',
        'Inability to wake or stay awake',
        'Bluish lips or face'
      ],
      exposures: [
        'You are caring for someone diagnosed with COVID',
        "You know you've recently been in a COVID compromised situation",
        'A contact tracer has recently notified you of an outbreak'
      ]
    }
  },

  methods: {
    ...mapActions({
      issueSelfCheckCred: 'ssi/issueSelfCheckCred'
    }),

    cancelSubmit() {
      this.$emit('submit', false)
    },

    setNewSymptoms({ newSymptoms }) {
      this.newSymptoms = newSymptoms
      this.step++
      this.fadeInStepButtons()
    },

    setCloseProximity({ closeProximity }) {
      this.closeProximity = closeProximity
      this.step++
      this.fadeInStepButtons()
    },

    setEmergencySymptoms({ emergencySymptoms }) {
      this.emergencySymptoms = emergencySymptoms
      this.step++
      this.fadeInStepButtons()
    },

    async submit({ testAdvised }) {
      this.testAdvised = testAdvised
      const { hostOrgId, email, closeProximity, newSymptoms, emergencySymptoms, issueSelfCheckCred } = this

      this.submitting = true
      try {
        await issueSelfCheckCred({ hostOrgId, patientEmail: email, closeProximity, newSymptoms, emergencySymptoms, testAdvised })
        this.submitted = true
      } catch (e) {
        console.log('An error encountered while submitting self check.', e)
      }

      this.$emit('submit', this.submitted)
      this.submitting = false
    },

    fadeInStepButtons() {
      this.stepped = false
      setTimeout(() => {
        this.stepped = true
      }, 400)
    }
  }
}
</script>
