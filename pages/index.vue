<template></template>

<script>
import { mapActions } from 'vuex'

export default {
  layout: 'empty',

  methods: {
    ...mapActions({
      checkLoginStatus: 'users/checkLoginStatus',
      grabProposedVerificationRequest: 'ssi/grabProposedVerificationRequest'
    })
  },

  async mounted() {
    const { id, ID } = this.$route.query
    if (id || ID) {
      this.grabProposedVerificationRequest({ id: id || ID })
    }

    const user = await this.checkLoginStatus()

    if (user) {
      await this.$router.push('/wallet')
    } else {
      await this.$router.push('/login')
    }
  }
}
</script>
