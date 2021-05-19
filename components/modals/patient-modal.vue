<template>
  <v-dialog
    v-model="showPatientModal"
    persistent
    max-width="750px"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    @click:outside="togglePatientModal()"
    class="py-1"
    style="box-shadow: unset !important"
  >
    <v-card v-if="test" color="#f5f5f5" tile class="py-1">
      <v-card-title>
        <Logo title="Test Credential Details" :modalTitle="true" />
      </v-card-title>

      <v-card-text>
        <v-card class="pa-3" tile>
          <v-card-text class="pa-0">
            <div class="text-right overline">Test Details</div>
            <v-row class="pl-4">
              <v-col cols="12" sm="6" class="pr-3">
                <v-combobox
                  v-model="test.credential.testName"
                  :items="testNames"
                  :disabled="isCovidCredentialGranted(test) || (!isCovidCredentialGranted(test) && !isNew(test))"
                  label="Test Name"
                  @keyup="setTestName"
                  autofocus
                  :append-icon="getNameIcon(test.credential.testName)"
                />
              </v-col>
              <v-col cols="12" sm="6" class="pr-3">
                <v-text-field
                  v-model="test.credential.testSubjectName"
                  type="text"
                  :disabled="true"
                  label="Subject Name"
                  :append-icon="getFullNameIcon(test.credential.testSubjectName)"
                />
              </v-col>
            </v-row>

            <v-row class="pl-4">
              <v-col cols="12" sm="6" class="pr-3">
                <v-combobox
                  v-model="test.credential.testManufacturerName"
                  :items="mfgs"
                  :disabled="isCovidCredentialGranted(test) || (!isCovidCredentialGranted(test) && !isNew(test))"
                  label="Test Manufacturer Name"
                  @keyup="setTestMfg"
                  :append-icon="getNameIcon(test.credential.testManufacturerName)"
                />
              </v-col>
              <v-col cols="12" sm="6" :class="{ 'pl-3': isNew(test) }" style="margin-top: -3px" v-if="testTime">
                <v-row class="pa-0 ma-0" v-if="isNew(test)">
                  <span style="font-size: 12px; color: #666 !important; z-index: 10; margin-left: -12px"> Test Date & Time </span>
                </v-row>
                <v-row style="margin-top: -10px" v-if="isNew(test)">
                  <DatePicker
                    :disabled="isCovidCredentialGranted(test) || (!isCovidCredentialGranted(test) && !isNew(test))"
                    @openChange="openDate"
                    ref="datePicker"
                    :allowClear="false"
                    class="mr-3"
                    size="large"
                    format="MMM D, YYYY"
                    valueFormat="YYYY-MM-DD HH:mm"
                    v-model="testTime"
                  />
                  <TimePicker
                    :disabled="isCovidCredentialGranted(test) || (!isCovidCredentialGranted(test) && !isNew(test))"
                    @openChange="openTime"
                    ref="timePicker"
                    :allowClear="false"
                    size="large"
                    format="h:mm A"
                    valueFormat="YYYY-MM-DD HH:mm"
                    use12Hours
                    v-model="testTime"
                  />
                </v-row>
                <v-text-field
                  v-if="!isNew(test)"
                  :disabled="true"
                  :value="testTime"
                  type="text"
                  label="Test Date & Time"
                  class="pr-3"
                  style="padding-top: 14px"
                  autofocus
                  :append-icon="getNameIcon(`${testTime}`)"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card class="px-3 mt-3" v-if="!isNew(test) || isCovidCredentialGranted(test)" tile>
          <v-card-text>
            <div class="text-right overline">Certifiable Results</div>
            <v-row class="pl-4 pt-5">
              <v-col cols="12" sm="4" class="pr-4">
                <v-text-field
                  v-model="test.credential.issuedByName"
                  type="text"
                  label="Issuing Doctor"
                  hint="Doctor's full name with credentials"
                  persistent-hint
                  :disabled="true"
                  :append-icon="getNameIcon(test.credential.issuedByName)"
                />
              </v-col>
              <v-col cols="12" sm="4" class="pr-3">
                <v-text-field
                  v-model="test.credential.issuedOnBehalfOfName"
                  type="text"
                  label="Issuing Organization"
                  persistent-hint
                  :disabled="true"
                  :append-icon="getNameIcon(test.credential.issuedOnBehalfOfName)"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field
                  v-if="isCovidCredentialGranted(test)"
                  v-model="test.credential.testResult"
                  type="text"
                  label="Test Result"
                  persistent-hint
                  :disabled="isCovidCredentialGranted(test)"
                  :append-icon="getNameIcon(test.credential.issuedOnBehalfOfName)"
                />
                <v-select
                  v-else
                  v-model="test.credential.testResult"
                  :items="['Negative', 'Positive']"
                  :disabled="isCovidCredentialGranted(test)"
                  label="Test Result"
                  hint="Test Result"
                  persistent-hint
                  return-object
                  single-line
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn color="secondary" @click="togglePatientModal()">Close</v-btn>
        <v-btn
          v-if="isNew(test) && !isCovidCredentialGranted(test)"
          style="min-width: 100px"
          color="primary"
          :loading="fetching && clicked == 'save'"
          @click="
            save({ test, event, hostOrgId })
            clicked = 'save'
          "
          :disabled="!formValid || (fetching && clicked == 'save')"
        >
          Save
        </v-btn>
        <v-btn
          style="min-width: 200px"
          v-if="!isNew(test) && !isCovidCredentialGranted(test)"
          color="primary"
          :loading="fetching && clicked == 'certify'"
          @click="
            offerCredential({ test, hostOrgId })
            clicked = 'certify'
          "
          :disabled="!formValid || (fetching && clicked == 'certify')"
        >
          Certify Test Results
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import global from '@/mixins/global'
import { getPickerDate } from '@/utils/date'
import selectedOrgMixin from '@/mixins/selectedOrg'
import Logo from '@/components/logo'

export default {
  mixins: [global, selectedOrgMixin],
  components: {
    Logo
  },
  props: {
    test: Object,
    isAwaitingResults: Function
  },
  data() {
    return {
      event: 'finish observation',
      clicked: null
    }
  },
  computed: {
    ...mapGetters({
      showPatientModal: 'users/showPatientModal',
      fetching: 'fetching',
      loginError: 'users/loginError',
      user: 'users/user',
      mfgs: 'users/mfgs',
      testNames: 'users/testNames',
      verifyId: 'ssi/verifyId'
    }),
    testTime: {
      get() {
        let { testTime } = this.test.credential
        if (testTime && testTime !== 'undefined') {
          if (this.isCovidCredentialGranted(this.test)) {
            return this.$options.filters.prettyLocalCertDate(getPickerDate(this.test.credential.testTime))
          } else {
            return getPickerDate(this.test.credential.testTime)
          }
        }
      },
      set(testTime) {
        this.test.credential.testTime = testTime
      }
    },
    max() {
      const date = new Date()
      const year = date.getUTCFullYear()
      let month = 1 + date.getUTCMonth()
      month = month < 10 ? '0' + month : month
      let day = date.getUTCDate()
      day = day < 10 ? `0${day}` : day
      const max = `${year}-${month}-${day}`
      return max
    },

    formValid() {
      const { isNew, test } = this
      const { testSubjectName, testName, testManufacturerName, testTime, testResult, issuedByName, issuedOnBehalfOfName } = test.credential

      const newTest =
        testSubjectName && testSubjectName.length && testName && testName.length && testManufacturerName && testManufacturerName.length

      if (isNew(test)) return newTest

      const validResults =
        testResult && testResult.length && issuedByName && issuedByName.length && issuedOnBehalfOfName && issuedOnBehalfOfName

      if (!isNew(test)) return newTest && validResults
    }
  },
  methods: {
    ...mapMutations({
      togglePatientModal: 'users/togglePatientModal'
    }),
    ...mapActions({
      save: 'users/save',
      offerCredential: 'ssi/offerCredential'
    }),
    setTestName(event) {
      if (!event) return
      const { value: testName } = event.target
      this.test.credential.testName = testName
    },
    setTestMfg(event) {
      if (!event) return
      const { value: testManufacturerName } = event.target
      this.test.credential.testManufacturerName = testManufacturerName
    },
    openDate(open) {
      if (!open) return
      this.$refs.datePicker.focus()
    },
    openTime(open) {
      if (!open) return
      this.$refs.timePicker.focus()
    },
    isCovidCredentialGranted(test) {
      return test && test.state === 'credential issued'
    },
    isNew(test) {
      return test && test.state === 'new'
    },
    getPickerDate(dateTime) {
      if (!dateTime || dateTime === 'undefined') return
      return getPickerDate(dateTime)
    }
  },
  watch: {
    test: {
      deep: true,
      handler() {
        if (!this.test.credential.issuedByName) this.test.credential.issuedOnBehalfOfName = this.selectedOrg.name
        if (!this.test.credential.issuedByName) this.test.credential.issuedByName = this.user.name
        if (!this.test.credential.testResult) this.test.credential.testResult = ''
      }
    }
  }
}
</script>
