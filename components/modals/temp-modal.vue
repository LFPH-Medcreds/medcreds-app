<template>
  <v-dialog
    v-model="showTempModal"
    persistent
    max-width="300px"
    @click:outside="submit(false)"
    style="box-shadow: unset !important; background-color: white"
  >
    <IssueTempCredential :key="instance" :email="activePatient && activePatient.email" @submit="submit" />
  </v-dialog>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import IssueTempCredential from '../issue/issue-temp-credential'
import global from '@/mixins/global'
import selectedOrgMixin from '@/mixins/selectedOrg'

export default {
  mixins: [global, selectedOrgMixin],

  components: {
    IssueTempCredential
  },

  data() {
    return {
      instance: 0
    }
  },

  computed: {
    ...mapGetters({
      showTempModal: 'users/showTempModal',
      activePatient: 'users/activePatient'
    })
  },

  methods: {
    ...mapMutations({
      toggleTempModal: 'users/toggleTempModal',
      setSnackbarText: 'setSnackbarText'
    }),

    async submit(success) {
      this.toggleTempModal()
    }
  },

  watch: {
    showTempModal() {
      this.instance++
    }
  }
}
</script>
