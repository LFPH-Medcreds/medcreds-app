<template>
  <div :id="id">
    <v-list subheader two-line v-if="!filteredVerifications.length">
      <v-list-item>
        <v-list-item-subtitle class="ml-1">No active verification present.</v-list-item-subtitle>
      </v-list-item>
    </v-list>

    <v-expansion-panels v-model="openList" multiple v-if="filteredVerifications.length" tile :flat="$vuetify.breakpoint.xsOnly">
      <VerificationProof
        v-for="(verification, index) in currentVerifications"
        :key="index"
        :wallet="wallet"
        :user="user"
        :display-as-consent="displayAsConsents"
        :short-description="shortDescriptions"
        :pre-load="autoOpenNew && index === 0 && currentPage === 1"
        :verification="verification"
      />

      <v-pagination
        v-model="currentPage"
        @input="clearList()"
        :length="Math.ceil(filteredVerifications.length / perPage)"
        :total-visible="7"
      />
    </v-expansion-panels>
  </div>
</template>

<script>
import VerificationProof from '@/components/proofs/VerificationProof'
import moment from 'moment'

export default {
  components: {
    VerificationProof
  },
  props: {
    wallet: Object,
    verifications: Array,
    autoOpenNew: Boolean,
    displayAsConsents: Boolean,
    shortDescriptions: Boolean,
    user: Object,
    id: String,
    filter: String,
    filterAfterUtc: Object
  },

  computed: {
    currentVerifications() {
      return this.filteredVerifications.slice((this.currentPage - 1) * this.perPage, this.currentPage * this.perPage)
    },
    pageCount() {
      return Math.ceil(this.filteredVerifications.length / this.perPage)
    },
    maxId() {
      return this.verifications && Math.max(...this.verifications.map((v) => v.id))
    }
  },

  methods: {
    clearList() {
      this.openList = []
    },
    filterVerifications() {
      this.filteredVerifications = this.verifications.filter((v) => {
        const time = new moment(v.createdAt).utc()

        if (this.filterAfterUtc && time < this.filterAfterUtc) {
          return false
        }

        if (this.filter && this.filter.length) {
          return v.holder && v.holder.name && v.holder.name.toLowerCase().includes(this.filter.toLowerCase())
        }

        return true
      })
    },

    updateVerifications() {
      this.filterVerifications()

      const { openList, autoOpenNew, currentPage, verifications, filteredVerifications, lastId } = this

      if (autoOpenNew && currentPage === 1) {
        const newList = [...openList]
        for (let i = 0; i < filteredVerifications.length; i++) {
          if (lastId && filteredVerifications[i].id > lastId) {
            newList.push(i)
          }
        }

        this.openList = newList
        this.lastId = verifications && Math.max(...verifications.map((v) => v.id))
      }
    }
  },

  watch: {
    filterAfterUtc() {
      this.filterVerifications()
      if (this.pageCount < this.currentPage) {
        this.currentPage = this.pageCount
      }
      if (this.currentPage < 1 && this.pageCount > 0) {
        this.currentPage = 1
      }
    },

    verifications() {
      this.updateVerifications()
    }
  },

  mounted() {
    this.updateVerifications()
  },

  data() {
    return {
      lastId: null,
      openList: [],
      currentPage: 1,
      perPage: 10,
      filteredVerifications: []
    }
  }
}
</script>
