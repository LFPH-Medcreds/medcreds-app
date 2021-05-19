<template>
  <div>
    <transition name="fade-transition">
      <v-container fluid fill-height pt-0 class="animated pa-4">
        <v-row justify="center" class="">
          <v-col cols="12" sm="10" md="10" lg="10" xl="10">
            <center v-if="(!tests || (tests && !tests.length)) && fetching" style="margin-top: 100px">
              <v-progress-circular indeterminate size="50" color="blue" />
              <div class="overline mt-3">Loading Tests</div>
            </center>
            <center v-if="(!tests || (tests && !tests.length)) && !fetching" style="margin-top: 100px">
              <v-col cols="12" sm="4" class="subtitle-1">
                Welcome to your ProofMarket Issuer Portal.
                <Logo />
              </v-col>
            </center>

            <transition-group name="fade">
              <div
                v-show="tests && tests.length"
                key="test-filter-group"
                class="mt-5"
                style="display: fixed; top: 100px; left: 10px; text-align: center"
              >
                <v-container fluid>
                  <v-row align="center">
                    <v-col cols="4">
                      <autocomplete placeholder="Search for test..." :search="search" @submit="onSearch"></autocomplete>
                    </v-col>
                  </v-row>
                </v-container>
                <v-btn-toggle mandatory borderless class="ml-5" v-model="localFilterBy">
                  <template>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn value="all" v-bind="attrs" v-on="on">
                          <v-icon>mdi-account-group</v-icon>
                        </v-btn>
                      </template>
                      All tests
                    </v-tooltip>
                  </template>
                  <template>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn value="pending" v-bind="attrs" v-on="on">
                          <v-icon>mdi-account-clock</v-icon>
                        </v-btn>
                      </template>
                      Pending tests
                    </v-tooltip>
                  </template>
                  <template>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn value="awaiting" v-bind="attrs" v-on="on">
                          <v-icon>mdi-microscope</v-icon>
                        </v-btn>
                      </template>
                      Tests awaiting results
                    </v-tooltip>
                  </template>
                  <template>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn value="issued" v-bind="attrs" v-on="on">
                          <v-icon>mdi-check</v-icon>
                        </v-btn>
                      </template>
                      Tests with issued results
                    </v-tooltip>
                  </template>
                </v-btn-toggle>
              </div>

              <v-timeline
                key="tests-timeline"
                align-top
                :dense="$vuetify.breakpoint.smAndDown"
                v-show="filteredTests && filteredTests.length"
                class="mt-5"
              >
                <RecycleScroller
                  class="scroller"
                  :items="filteredTests"
                  :item-size="200"
                  key-field="id"
                  :prerender="15"
                  v-slot="{ item }"
                  :buffer="300"
                  page-mode
                >
                  <transition-group name="fade">
                    <v-timeline-item :key="item.id" :color="getColor(item)" :icon="getIcon(item)" :left="true" fill-dot>
                      <transition name="fade-transition">
                        <v-card :color="getColor(item)" dark>
                          <v-list-item two-line>
                            <v-list-item-content>
                              <v-list-item-title class="headline">
                                <span v-if="!isCredentialGranted(item) && !isAwaitingResults(item)" class="text-right">
                                  {{ item.subjectName }}
                                </span>

                                <div v-if="isCredentialGranted(item)">
                                  {{ item.subjectName }}
                                </div>

                                <div v-if="isAwaitingResults(item)">
                                  {{ item.subjectName }}
                                </div>
                              </v-list-item-title>

                              <v-list-item-subtitle>
                                <span v-if="isPending(item)"> Requested on {{ item.createdAt | prettyLocalDate }} </span>
                                <span v-else="isAwaitingResults(item)">
                                  Administered on {{ item.credential.testTime | prettyLocalCertDate }}
                                </span>
                              </v-list-item-subtitle>

                              <v-list-item-action-text>
                                <span v-if="!isCredentialGranted(item) && !isAwaitingResults(item)" class="pt-3" style="float: right">
                                  <v-btn color="white" @click="openPatientModal(item)" class="my-1" outlined>
                                    <v-icon class="mb-1 mr-2"> mdi-account-multiple-plus </v-icon>
                                    Start test
                                  </v-btn>
                                </span>

                                <span v-if="isCredentialGranted(item)" class="pt-3" style="float: right">
                                  <v-btn color="white" @click="openPatientModal(item)" class="my-1" min-width="130px" outlined>
                                    <v-icon class="mr-2"> mdi-card-account-details-outline </v-icon>
                                    View Credential
                                  </v-btn>
                                </span>
                                <span v-if="isCredentialGranted(item)" class="mx-1 pt-3" style="float: right"> </span>
                                <span v-if="false && isCredentialGranted(item)" class="pt-3" style="float: right">
                                  <v-tooltip top>
                                    <template v-slot:activator="{ on }">
                                      <v-btn v-on="on" color="white" class="my-1" min-width="130px" outlined>
                                        <v-icon class="mb-1 mr-2"> mdi-account-remove </v-icon>
                                        Revoke
                                      </v-btn>
                                    </template>
                                    <span>Feature pending future release</span>
                                  </v-tooltip>
                                </span>

                                <span v-if="isAwaitingResults(item)" class="pt-3" style="float: right">
                                  <v-btn color="white" class="my-1" @click="openPatientModal(item)" outlined>
                                    <v-icon class="mb-1 mr-2"> mdi-microscope </v-icon>
                                    Certify Results
                                  </v-btn>
                                </span>
                              </v-list-item-action-text>
                            </v-list-item-content>
                          </v-list-item>
                        </v-card>
                      </transition>
                    </v-timeline-item>
                  </transition-group>
                </RecycleScroller>
              </v-timeline>
            </transition-group>
          </v-col>
        </v-row>
      </v-container>
    </transition>

    <PatientModal :test="activeTest" :isAwaitingResults="isAwaitingResults" />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import global from '@/mixins/global'
import PatientModal from '@/components/modals/patient-modal'
import Logo from '@/components/logo'
import selectedOrgMixin from '@/mixins/selectedOrg'
import Autocomplete from '@trevoreyre/autocomplete-vue'

export default {
  mixins: [global, selectedOrgMixin],
  components: {
    PatientModal,
    RecycleScroller,
    Logo,
    Autocomplete
  },
  head() {
    return {
      title: 'Doctor Portal'
    }
  },

  fetchOnServer: false,

  async fetch() {
    if (!this.filteredTests) this.filteredTests = []
    let { getTests, hostOrgId, getCredentialDefinitions } = this

    await getTests(hostOrgId)
    this.$nextTick(async () => {
      if (hostOrgId) await getCredentialDefinitions({ hostOrgId })
    })
  },

  mounted() {
    const { filter } = this.$route.query
    if (filter) this.setFilterBy(filter)
    if (filter) this.localFilterBy = filter
    else this.localFilterBy = this.filterBy
  },

  data() {
    return {
      selectedDefinition: null,
      localFilterBy: 'all',
      filteredTests: null,
      activeTest: null,
      searchString: null,
      fab: false,
      headers: [
        { text: '', value: 'photo', align: 'center' },
        {
          text: '',
          align: 'center',
          sortable: false,
          value: 'name'
        },
        { text: '', value: 'email', align: 'center' },
        { text: '', value: 'data-table-expand' }
      ]
    }
  },
  methods: {
    ...mapActions({
      getTests: 'users/getTests',
      getCredentialDefinitions: 'ssi/getCredentialDefinitions'
    }),
    ...mapMutations({
      togglePatientModal: 'users/togglePatientModal',
      setFilterBy: 'users/setFilterBy'
    }),

    openPatientModal(test) {
      this.togglePatientModal()
      if (this.showPatientModal) this.activeTest = { ...test }
      else this.activeTest = null
    },

    getColor(test) {
      if (this.isAwaitingResults(test)) return '#ffb13e'
      if (this.isCredentialGranted(test)) return '#75c378'
      return '#6dacea'
    },

    getIcon(test) {
      if (this.isAwaitingResults(test)) return 'mdi-microscope'
      if (this.isCredentialGranted(test)) return 'mdi-check'
      return 'mdi-account-clock'
    },

    getInitials(name) {
      if (!name || !name.includes(' ')) return ''
      let parts = name.trim().split(' ')
      let initials = ''
      try {
        if (parts && parts.length > 1)
          initials = parts
            .map((part) => {
              return part[0] || ''
            })
            .join('')
        return initials && initials.toUpperCase()
      } catch (e) {
        console.error(e)
        return 'JD'
      }
    },

    isAwaitingResults(test) {
      return test && test.state === 'awaiting results'
    },

    isCredentialGranted(test) {
      return test && test.state === 'credential issued'
    },

    isPending(test) {
      return test && test.state === 'new'
    },

    filterTests(by) {
      this.filteredTests = []
      if (!this.tests) return
      switch (by) {
        case 'all':
          this.filteredTests = this.tests
          break
        case 'issued':
          this.filteredTests = this.tests.filter(this.isCredentialGranted)
          break
        case 'awaiting':
          this.filteredTests = this.tests.filter(this.isAwaitingResults)
          break
        case 'pending':
          this.filteredTests = this.tests.filter(this.isPending)
          break
      }
    },
    search(input) {
      if (input.length < 1) {
        this.filteredTests = this.tests
        return []
      }
      const unique = (value, index, self) => {
        return self.indexOf(value) === tests
      }
      this.searchString = input
      return this.tests
        .filter((test) => {
          return test.subjectName.toLowerCase().includes(input.toLowerCase())
        })
        .map((test) => test.subjectName)
        .filter(unique)
    },
    onSearch(result) {
      const searchTerm = result || this.searchString
      if (searchTerm) {
        this.filteredTests = this.tests.filter((test) => {
          return test.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
        })
      }
    }
  },
  watch: {
    filterBy(filterBy) {
      this.filterTests(filterBy)
    },

    localFilterBy(filterBy) {
      let { query } = this.$route
      query = { ...query, filter: filterBy }
      this.$router.push({ query })
      this.setFilterBy(filterBy)
    },
    async hostOrgId(hostOrgId) {
      await this.getCredentialDefinitions({ hostOrgId })
    },
    tests() {
      this.filterTests(this.filterBy)
    }
  },
  computed: {
    ...mapGetters({
      fetching: 'fetching',
      user: 'users/user',
      tests: 'users/tests',
      filterBy: 'users/filterBy',
      showPatientModal: 'users/showPatientModal',
      showEmailModal: 'users/showEmailModal',
      credentialDefinitions: 'ssi/credentialDefinitions'
    }),
    expanded() {
      return this.patients
    },
    definitions() {
      const { credentialDefinitions } = this
      return credentialDefinitions && credentialDefinitions.map((def) => def.name)
    }
  }
}
</script>
