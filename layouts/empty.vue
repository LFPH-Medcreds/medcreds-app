<template>
  <v-app dark>
    <LoadingIndicator v-if="fetching" :message="fetchingMessage || `Determining next action`" />
    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import LoadingIndicator from '@/components/loading-indicator'
import global from '@/mixins/global'

export default {
  mixins: [global],
  components: {
    LoadingIndicator
  },

  async mounted() {
    if (this.intercomEnabled) {
      try {
        await this.$intercom()
      } catch (e) {
        console.error('An error occurred while preparing the Intercom component.', e)
      }
    }
  },

  computed: {
    ...mapGetters({
      fetching: 'fetching',
      fetchingMessage: 'fetchingMessage'
    })
  },

  data() {
    return {
      title: 'ProofMarket'
    }
  }
}
</script>
