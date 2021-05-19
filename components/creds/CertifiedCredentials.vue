<script>
import CertifiedCredential from '@/components/creds/CertifiedCredential'

export default {
  props: {
    wallet: Object,
    credentials: Array,
    id: String
  },

  components: {
    CertifiedCredential
  },

  methods: {
    clearList() {
      this.openList = []
    }
  },

  data() {
    return {
      openList: [],
      currentPage: 1,
      perPage: 10
    }
  }
}
</script>

<template>
  <div :id="id">
    <v-list subheader two-line v-if="credentials && !credentials.length">
      <v-list-item>
        <v-list-item-subtitle class="ml-1" style="white-space: normal">
          No health credentials present. You will be notified by e-mail when your test results are available.
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>

    <v-expansion-panels v-model="openList" multiple v-if="credentials && credentials.length" tile :flat="$vuetify.breakpoint.xsOnly">
      <CertifiedCredential
        v-for="(credential, index) in credentials.slice((currentPage - 1) * perPage, currentPage * perPage)"
        :key="`${credential.credentialId}${index}`"
        :wallet="wallet"
        :credential="credential"
      />

      <v-pagination v-model="currentPage" :length="Math.ceil(credentials.length / perPage)" :total-visible="7" />
    </v-expansion-panels>
  </div>
</template>
