<template>
  <transition-group name="fade">
    <v-card key="users-table" class="ma-5">
      <v-card-title>
        <v-container fluid>
          <v-row>
            <v-col cols="12" sm="6" md="7" v-bind:align="$vuetify.breakpoint.smAndUp ? 'left' : 'center'">
              <v-btn-toggle v-model="period" color="primary" tile dense group mandatory>
                <v-btn value="day" class="ma-0 pa-1">Day</v-btn>
                <v-btn value="week" class="ma-0 pa-1">Week</v-btn>
                <v-btn value="month" class="ma-0 pa-1">Month</v-btn>
                <v-btn value="custom" class="ma-0 pa-1">Custom</v-btn>
              </v-btn-toggle>
            </v-col>

            <v-col
              cols="12"
              sm="6"
              md="2"
              :class="{ 'pr-5': $vuetify.breakpoint.smAndUp }"
              v-bind:align="$vuetify.breakpoint.smAndUp ? 'left' : 'center'"
            >
              <div v-if="period === 'custom'">
                <medcreds-date-picker mode="range" v-model="range" style="min-width: 215px" />
              </div>
            </v-col>

            <v-col cols="12" md="3" v-bind:align="$vuetify.breakpoint.smAndUp ? 'right' : 'center'">
              <v-text-field class="mt-0 pt-0" v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details />
            </v-col>
          </v-row>
        </v-container>
      </v-card-title>
      <v-divider />
      <v-card-subtitle class="subtitle-1" v-if="$vuetify.breakpoint.smAndUp">
        Verified users of <strong>{{ selectedOrg && selectedOrg.name }}</strong>
      </v-card-subtitle>

      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="verified"
        :loading="$fetchState.pending"
        :loading-text="`Loading ${hostOrgName} Verified Users`"
        sort-by="totalVerifications"
        :expanded.sync="expanded"
        :sort-desc="true"
        show-select
        must-sort
        :footer-props="{ 'items-per-page-options': [20, 50, -1] }"
        flat
        item-key="email"
        :search="search"
        class="pa-1"
      >
        <template v-slot:item="{ item: patient, expand, isExpanded, isSelected, select }">
          <tr @click="expand(!isExpanded)" style="cursor: pointer" :class="{ active: isExpanded }" v-if="$vuetify.breakpoint.xsOnly">
            <td>
              <v-list dense flat>
                <v-list-item dense append>
                  <v-checkbox max-width="30" :value="isSelected" @change="select" style="display: inline-block" />
                  <v-list-item-title>{{ patient.name }}</v-list-item-title>
                  <IconButton
                    id="send-email-mobile"
                    icon="mdi-email-lock"
                    tool-tip="Securely email this person."
                    tool-tip-left
                    @click.stop="
                      select()
                      toggleMassEmailModal()
                    "
                  />
                </v-list-item>
              </v-list>
            </td>
          </tr>
          <tr @click="expand(!isExpanded)" style="cursor: pointer" :class="{ active: isExpanded }" v-else>
            <td>
              <v-checkbox max-width="30" :value="isSelected" @change="select" style="display: inline-block" />
            </td>
            <td v-if="!$vuetify.breakpoint.xsOnly">
              {{ patient.name }}
            </td>
            <td v-if="!$vuetify.breakpoint.xsOnly">
              {{ patient.email }}
            </td>
            <td v-if="!$vuetify.breakpoint.xsOnly">
              <span class="overline">{{ patient.totalVerifications }}</span>
            </td>
            <td>
              <div style="text-align: center">
                <IconButton
                  id="send-email"
                  icon="mdi-email-lock"
                  tool-tip="Securely email this person."
                  tool-tip-left
                  @click.stop="
                    select()
                    toggleMassEmailModal()
                  "
                />
              </div>
            </td>
          </tr>
        </template>

        <template v-slot:expanded-item="{ headers, item: patient }">
          <tr class="active">
            <td :colspan="headers.length" class="pa-3 expanded-td">
              <VerificationProofs
                :verifications="patient.verifications"
                :user="patient"
                :wallet="{ verificationConsents: patient.verifications }"
                id="wallet-verification-list"
              />
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
import IconButton from '@/components/icon-button'
import MassEmailModal from '@/components/modals/mass-email-modal'
import VerificationProofs from '@/components/proofs/VerificationProofs'
import selectedOrgMixin from '@/mixins/selectedOrg'
import moment from 'moment'

export default {
  async fetch() {
    const { hostOrgId, getVerified, start, end, period } = this

    let actualStart = start && moment(start)
    let actualEnd = moment()

    if (period === 'day') {
      actualStart = moment()
    } else if (period === 'week') {
      actualStart = moment().subtract(1, 'week')
    } else if (period === 'month') {
      actualStart = moment().subtract(1, 'month')
    } else if (period === 'custom') {
      actualEnd = moment(end)
    }

    actualStart = actualStart.startOf('day').toDate()
    actualEnd = actualEnd.startOf('day').toDate()

    await getVerified({ hostOrgId, start: actualStart, end: actualEnd })
  },

  fetchOnServer: false,

  components: {
    VerificationProofs,
    MassEmailModal,
    IconButton
  },

  mixins: [selectedOrgMixin],

  watch: {
    range: {
      deep: true,
      handler() {
        this.$fetch()
      }
    },
    period: {
      deep: true,
      handler() {
        this.$fetch()
      }
    }
  },

  data() {
    return {
      creds: {},
      period: 'day',
      filter: {},
      sortDesc: false,
      expanded: [],
      selected: [],
      search: '',
      range: {
        start: new Date(),
        end: new Date()
      },
      headers: [
        {
          text: 'Name',
          align: 'left',
          value: 'name'
        },
        {
          text: 'Email',
          align: 'left',
          value: 'email'
        },
        {
          text: 'Proofs',
          align: 'left',
          value: 'totalVerifications'
        },
        {
          text: 'Contact',
          align: 'center'
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      user: 'users/user',
      wallet: 'users/orgwallet',
      fetching: 'fetching',
      verified: 'users/verified',
      activePatient: 'users/activePatient'
    }),
    start() {
      return this.range && this.range.start
    },
    end() {
      return this.range && this.range.end
    },
    selectedUsers() {
      return this.selected.map(({ email, name, phone }) => {
        return { email, name, phone }
      })
    }
  },

  methods: {
    ...mapMutations({
      toggleMassEmailModal: 'users/toggleMassEmailModal',
      setActivePatient: 'users/setActivePatient'
    }),
    ...mapActions({
      getVerified: 'users/getVerified'
    })
  }
}
</script>
