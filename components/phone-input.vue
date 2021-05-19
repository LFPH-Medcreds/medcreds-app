<template>
  <vue-tel-input-vuetify
    class="my-2"
    outlined
    :valid-characters-only="true"
    :preferredCountries="preferredCountryCodes"
    mode="international"
    defaultCountry="US"
    :placeholder="placeholder"
    @input="onInput"
  />
</template>

<script>
import VueTelInputVuetify from 'vue-tel-input-vuetify/lib/vue-tel-input-vuetify.vue'
import validators from '@/mixins/validators'

export default {
  mixins: [validators],
  props: {
    placeholder: String,
    value: String
  },

  components: {
    VueTelInputVuetify
  },

  data() {
    return {
      phone: {
        number: '',
        valid: false,
        country: undefined
      }
    }
  },

  methods: {
    onInput(formattedNumber, { number, valid, country }) {
      this.phone.number = number.international
      this.phone.valid = valid
      this.phone.country = country && country.name

      if (this.phone.valid) {
        this.$emit('input', this.phone.number)
      } else {
        this.$emit('input', null)
      }
    }
  }
}
</script>
