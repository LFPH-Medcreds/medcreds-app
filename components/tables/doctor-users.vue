<template>
  <transition-group name="fade">
    <!-- <center v-show="$fetchState.pending" style="margin-top: 200px;" key="fetching">
      <v-progress-circular indeterminate size="50" color="blue" />
      <div class="overline mt-3">
        Loading {{ hostOrgName }} Users
      </div>
    </center> -->
    <!-- <v-overlay :value="$fetchState.pending" key="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay> -->

    <v-card key="users-table" :class="{ 'ma-5': !$vuetify.breakpoint.xsOnly }">
      <v-toolbar color="blue" dark :class="{ 'mt-5': $vuetify.breakpoint.smAndUp }">
        <v-toolbar-title style="white-space: unset !important">
          <div class="pt-3 mb-3 web">Patient Administration</div>
          <div class="pt-3 mb-3 mobile subtitle-1">Patient Administration</div>
        </v-toolbar-title>

        <v-spacer />
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
      </v-toolbar>

      <v-card-subtitle class="subtitle-1">
        {{ selectedOrg && selectedOrg.name }}
      </v-card-subtitle>
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="patients"
        :loading="$fetchState.pending && !patients.length"
        :loading-text="`Loading ${hostOrgName} Users`"
        sort-by="createdAtUtc"
        :sort-desc="true"
        must-sort
        flat
        show-select
        :show-expand="false"
        item-key="email"
        :search="search"
        :footer-props="{ 'items-per-page-options': [20, 50, -1] }"
        class="pa-1"
      >
        <template v-slot:item="{ item: patient, index: i, expand, isExpanded, isSelected, select }">
          <!-- <tr @click="expand(!isExpanded)" style="cursor: pointer;" :class="{ active: isExpanded }"> -->
          <tr>
            <td>
              <v-checkbox :value="isSelected" @click.stop="select" style="display: inline-block" class="pt-n4" />

              <div v-if="$vuetify.breakpoint.xsOnly" style="display: inline-block; line-height: 1.2" class="mb-n2">
                <div>
                  {{ patient.name }}
                </div>
                <div v-if="$vuetify.breakpoint.xsOnly">
                  {{ patient.email }}
                </div>
              </div>
              <div class="ml-2 mt-n3 mb-3" style="margin-left: 35px !important" v-if="$vuetify.breakpoint.xsOnly">
                <span class="subtitle-1">
                  Medical Tests:
                  {{ patient.tests.length }}
                </span>
                <v-btn
                  x-small
                  fab
                  class="ml-3"
                  color=""
                  :loading="fetching && i === index"
                  :disabled="fetching && i === index"
                  @click.stop="
                    newTest({ email: patient.email, hostOrgId })
                    index = i
                  "
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>
              <div class="ml-n2 mb-3" v-if="$vuetify.breakpoint.xsOnly">
                <v-btn small text class="ml-5" color="" @click.stop="patientTempModal(patient)">
                  <v-icon> mdi-thermometer </v-icon>
                  Temp
                </v-btn>

                <v-btn small text class="ml-5" color="" @click.stop="patientSelfCheckModal(patient)">
                  <v-icon> mdi-account-check </v-icon>
                  Health Check
                </v-btn>
              </div>
              <div v-if="$vuetify.breakpoint.xsOnly" style="float: right">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-on="on" @click.stop="toggleMassEmailModal()">
                      <v-icon>mdi-email-lock</v-icon>
                    </v-btn>
                  </template>
                  Securely email this person.
                </v-tooltip>
              </div>
            </td>
            <td v-if="!$vuetify.breakpoint.xsOnly">
              {{ patient.name }}
            </td>
            <td v-if="!$vuetify.breakpoint.xsOnly">
              {{ patient.email }}
            </td>
            <td v-if="!$vuetify.breakpoint.xsOnly">
              <div style="text-align: center">
                {{ patient.tests.length }}

                <v-btn
                  x-small
                  fab
                  class="ml-3"
                  color=""
                  :loading="fetching && i === index"
                  :disabled="fetching && i === index"
                  @click.stop="
                    newTest({ email: patient.email, hostOrgId })
                    index = i
                  "
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>
            </td>
            <td v-if="!$vuetify.breakpoint.xsOnly">
              <div style="text-align: center">
                <v-btn small text class="ml-5" color="" @click.stop="patientTempModal(patient)">
                  <v-icon> mdi-thermometer </v-icon>
                  Temp
                </v-btn>

                <v-btn small text class="ml-5" color="" @click.stop="patientSelfCheckModal(patient)">
                  <v-icon> mdi-account-check </v-icon>
                  Health Check
                </v-btn>
              </div>
            </td>
            <td v-if="!$vuetify.breakpoint.xsOnly">
              <div style="text-align: center">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-on="on"
                      @click.stop="
                        select()
                        toggleMassEmailModal()
                      "
                    >
                      <v-icon>mdi-email-lock</v-icon>
                    </v-btn>
                  </template>
                  Securely email this person.
                </v-tooltip>
              </div>
            </td>
          </tr>
        </template>

        <template v-slot:expanded-item="{ headers, item: patient }">
          <tr class="active">
            <td :colspan="headers.length" class="pa-3 expanded-td">
              <v-expansion-panels class="mb-6">
                <v-expansion-panel :disabled="patient.tests.length < 2">
                  <v-expansion-panel-header expand-icon="mdi-menu-down">
                    <v-list v-if="patient.tests.length">
                      <v-list-item>
                        {{ patient.tests[0].state }}
                      </v-list-item>
                      <v-list-item>
                        {{ patient.tests[0].createdAt | prettyLocalDate }}
                      </v-list-item>
                    </v-list>
                    <v-list v-else>
                      <v-list-item> No test records. </v-list-item>
                      <v-list-item> </v-list-item>
                    </v-list>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-list dense>
                      <v-list-item v-for="(test, index) in patient.tests" :key="index" v-show="index !== 0">
                        <v-list-item-content>
                          <v-list>
                            <v-list-item>
                              {{ test.state }}
                            </v-list-item>

                            <v-list-item>
                              {{ test.createdAt | prettyDate }}
                            </v-list-item>
                          </v-list>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </td>
          </tr>
        </template>
      </v-data-table>
      <MassEmailModal :selected="selectedUsers" />
    </v-card>
  </transition-group>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import selectedOrgMixin from '@/mixins/selectedOrg'
import global from '@/mixins/global'
import tableControls from '@/mixins/tableControls'
import MassEmailModal from '@/components/modals/mass-email-modal'

export default {
  async fetch() {
    const { hostOrgId, getPatients } = this
    await getPatients({ hostOrgId })
    setTimeout(() => {
      this.show1 = true
    }, 100)
  },
  fetchOnServer: false,

  mixins: [global, selectedOrgMixin, tableControls],
  data() {
    return {
      creds: {},
      search: '',
      expanded: [],
      index: -1,
      headers: [
        { text: 'Name', align: 'left', value: 'name' },
        { text: 'Email', align: 'left', value: 'email' },
        { text: 'Medical Tests', align: 'center', value: 'testCount' },
        { text: 'Certify', align: 'center' },
        { text: 'Contact', align: 'center' }
      ]
    }
  },
  computed: {
    ...mapGetters({
      user: 'users/user',
      wallet: 'users/orgwallet',
      orgs: 'ssi/orgs',
      fetching: 'fetching',
      patients: 'users/patients',
      activePatient: 'users/activePatient'
    })
  },
  methods: {
    patientTempModal(patient) {
      this.setActivePatient(patient)
      this.toggleTempModal()
    },
    patientSelfCheckModal(patient) {
      this.setActivePatient(patient)
      this.toggleSelfCheckModal({ forOther: true })
    },
    ...mapMutations({
      toggleTempModal: 'users/toggleTempModal',
      toggleSelfCheckModal: 'users/toggleSelfCheckModal',
      setActivePatient: 'users/setActivePatient'
    }),
    ...mapActions({
      getCredentials: 'ssi/getCredentials',
      deleteCredential: 'ssi/deleteCredential',
      getWallet: 'users/getOrgWallet',
      getPatients: 'users/getPatients',
      newTest: 'users/newTest'
    }),
    async getCreds({ item, hostOrgId }) {
      hostOrgId = hostOrgId || this.hostOrgId
      const { connectionId } = item
      const cred = await this.getCredentials({
        hostOrgId,
        connectionId
      })
      this.creds[connectionId] = cred
      this.$forceUpdate()
    },
    async deleteCred(credentialId, hostOrgId, connectionId) {
      await this.deleteCredential({
        hostOrgId,
        credentialId
      })
      await this.getCreds(connectionId, hostOrgId)
    }
  }
}
</script>
