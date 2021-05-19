<template>
  <v-dialog
    v-model="showSelfCheckModal.showState"
    persistent
    :fullscreen="$vuetify.breakpoint.smAndDown"
    max-width="800px"
    @click:outside="submit(false)"
    style="box-shadow: unset !important; background-color: white"
  >
    <IssueSelfCheckCredential
      :key="instance"
      :email="activePatient && activePatient.email"
      :for-other="showSelfCheckModal.forOther"
      @submit="submit"
    />
  </v-dialog>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import IssueSelfCheckCredential from '../issue/issue-self-check-credential'
import global from '@/mixins/global'
import selectedOrgMixin from '@/mixins/selectedOrg'

export default {
  mixins: [global, selectedOrgMixin],

  data() {
    return {
      instance: 0
    }
  },

  components: {
    IssueSelfCheckCredential
  },

  computed: {
    ...mapGetters({
      showSelfCheckModal: 'users/showSelfCheckModal',
      activePatient: 'users/activePatient'
    })
  },

  methods: {
    ...mapMutations({
      toggleSelfCheckModal: 'users/toggleSelfCheckModal'
    }),

    async submit(success) {
      this.toggleSelfCheckModal()
    }
  },

  watch: {
    showSelfCheckModal() {
      this.instance++
    }
  }
}
</script>
