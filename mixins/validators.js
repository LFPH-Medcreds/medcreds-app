import PhoneNumber from 'awesome-phonenumber'

export default {
  data() {
    return {
      preferredCountryCodes: ['CA', 'US', 'GB', 'PT', 'ZA', 'RO', 'RW', 'KE', 'NG', 'SO'],
      defaultTo: 'US'
    }
  },
  methods: {
    validateMobileNumber(dest) {
      const destNumber = new PhoneNumber(dest)
      const region = destNumber.getRegionCode()
      if (region && destNumber.isValid()) return destNumber.getNumber()
      // PhoneNumber seems valid so we transform it to international
      // if not international already. Defaults to US intl prefix
      const intlPhoneNumber = new PhoneNumber(dest, this.defaultTo)
      if (intlPhoneNumber.isValid()) return intlPhoneNumber.getNumber()
      return null
    }
  }
}
