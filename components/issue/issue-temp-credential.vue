<template>
  <div style="background: white; padding: 30px">
    <v-row class justify="start">
      <v-col cols="4" class="ml-3 mr-3">
        <v-text-field
          autofocus
          type="number"
          dense
          ref="temp"
          v-model="temp"
          step=".1"
          label="Temp"
          outlined
          :disabled="submitting || submitted"
          @keypress.enter="submit()"
        />
      </v-col>
      <v-col cols="3">
        <v-btn-toggle dense v-model="isCelsius" class="p1-3">
          <v-btn color="white">
            <v-icon>mdi-temperature-fahrenheit</v-icon>
          </v-btn>

          <v-btn color="white">
            <v-icon>mdi-temperature-celsius</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <v-spacer />
    <v-row justify="end">
      <v-col>
        <v-btn
          style="color: white"
          color="blue darken-1"
          block
          :loading="submitting"
          @click="submit()"
          :disabled="!formValid || submitting || submitted"
        >
          Certify Temperature
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import global from '@/mixins/global'
import selectedOrgMixin from '@/mixins/selectedOrg'

export default {
  mixins: [global, selectedOrgMixin],

  props: {
    email: String
  },

  data() {
    return {
      temp: null,
      submitting: false,
      submitted: false,
      isCelsius: 0 // 0 = F, 1 = C
    }
  },

  watch: {
    temp(temp) {
      if (temp > 10 && (temp > this.maxTemp || temp < this.minTemp)) {
        const symbol = this.isCelsius ? '&#8451;' : '&#8457;'
        this.setSnackbarText(`${this.minTemp}${symbol} - ${this.maxTemp}${symbol} is the range.`)
        this.$nextTick(() => {
          this.temp = null
          this.$refs.temp.focus()
        })
      }
    }
  },

  computed: {
    maxTemp() {
      const { isCelsius } = this
      return isCelsius ? 40.0 : 104.0
    },

    minTemp() {
      const { isCelsius } = this
      return isCelsius ? 32.0 : 89.6
    },

    formValid() {
      return this.temp
    }
  },

  methods: {
    ...mapMutations({
      setSnackbarText: 'setSnackbarText'
    }),
    ...mapActions({
      issueTempCred: 'ssi/issueTempCred'
    }),

    async submit() {
      const { hostOrgId, temp, isCelsius, email } = this
      this.submitting = true

      try {
        await this.issueTempCred({ hostOrgId, temp, tempUnits: isCelsius, patientEmail: email })
        this.submitted = true
      } catch (e) {
        console.log('An error encountered while submitting temperature.', e)
      }

      this.$emit('submit', this.submitted)
      this.submitting = false
    }
  }
}
</script>
