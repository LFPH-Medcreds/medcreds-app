<template>
  <transition-group name="fade">
    <v-card key="organizations-table" :class="{ 'ma-5': !$vuetify.breakpoint.xsOnly }">
      <v-toolbar color="blue" dark :class="{ 'mt-5': $vuetify.breakpoint.smAndUp }">
        <v-toolbar-title style="white-space: unset !important">
          <div class="pt-3 mb-3 web">Organization Management</div>
          <div class="pt-3 mb-3 mobile subtitle-1">Organization Management</div>
        </v-toolbar-title>
      </v-toolbar>

      <v-data-table
        :headers="orgHeaders"
        :expanded.sync="expanded"
        :loading="$fetchState.pending && !orgs.length"
        :loading-text="`Loading Organizations`"
        single-expand
        flat
        item-key="id"
        show-expand
        class="pa-1"
        @item-expanded="itemExpanded"
        :items="orgs"
        :items-per-page="-1"
      >
        <!-- edit org name -->
        <template v-slot:item.name="props">
          <v-edit-dialog :return-value.sync="props.item.name" @save="save(props.item)" large>
            {{ props.item.name }}
            <template v-slot:input>
              <v-text-field v-model="props.item.name" label="Org Name" />
            </template>
          </v-edit-dialog>
        </template>

        <!-- edit parent org -->
        <template v-slot:item.parentOrg="props">
          <v-edit-dialog :return-value.sync="props.item.parentOrgId" @save="save(props.item)" large>
            {{ getParentName(props.item.parentOrgId) }}
            <template v-slot:input>
              <v-select
                :items="rootOrgs"
                item-text="name"
                item-value="id"
                :disabled="props.item.roles.includes('root')"
                v-model="props.item.parentOrgId"
                label="Parent Org"
              />
            </template>
          </v-edit-dialog>
        </template>

        <!-- roles -->
        <template v-slot:item.roles="props">
          {{ props.item.roles.join(', ') }}
        </template>

        <template v-slot:expanded-item="{ headers, item: org }">
          <td :colspan="headers.length">
            <OrgUsers />

            <center v-if="!(usageByCheckpoint && usageByCheckpoint.length)" style="padding-top: 50px">
              <v-progress-circular size="50" indeterminate color="blue" />
              <div class="overline mt-3">Fetching Data</div>
            </center>
            <v-col v-if="usageByCheckpoint && usageByCheckpoint.length">
              <v-row class="display-1 py-3" justify="end">
                <v-col cols="12" sm="4">
                  <v-select solo :items="intervals" :value="interval" @input="intervalSelected" flat />
                </v-col>
              </v-row>
              <v-row v-if="false">
                <v-col>
                  <GChart
                    v-if="usageByCheckpoint && usageByCheckpoint.length"
                    type="ColumnChart"
                    :data="usageByCheckpointData"
                    :options="usageByCheckpointOptions"
                  />
                </v-col>
              </v-row>
            </v-col>
          </td>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-icon small :id="`icon-chartbar-${item.id}`" @click="orgRowSelected(item)"> mdi-chart-bar </v-icon>
          <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
          <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
      <v-card-actions>
        <OrgModal @open="showOrgModal = true" @close="orgModalClose" @save="orgModalSave" :org="org" :show="showOrgModal" />
      </v-card-actions>
    </v-card>
  </transition-group>
</template>

<script>
import global from '@/mixins/global'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import OrgModal from '@/components/modals/org-modal'
import OrgUsers from '@/components/tables/org-users'
import IconButton from '@/components/icon-button'
import { GChart } from 'vue-google-charts'

const intervals = [
  {
    text: 'Usage by Checkpoint Past 30 Days',
    value: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date()
    }
  },
  {
    text: 'Usage by Checkpoint Past 7 Days',
    value: {
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      end: new Date()
    }
  },
  {
    text: 'Usage by Checkpoint Past 1 Day',
    value: {
      start: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      end: new Date()
    }
  },
  {
    text: 'Usage by Checkpoint Past 1 Hour',
    value: {
      start: new Date(Date.now() - 60 * 60 * 1000),
      end: new Date()
    }
  },
  {
    text: 'Usage by Checkpoint Past Year',
    value: {
      start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      end: new Date()
    }
  }
]

export default {
  mixins: [global],
  components: {
    GChart,
    OrgModal,
    OrgUsers,
    IconButton
  },
  head() {
    return {
      title: 'Admin Portal'
    }
  },
  async fetch() {
    let { getUsageByCheckpoint, getOrgs } = this
    await getUsageByCheckpoint({})
    await getOrgs()
  },
  fetchOnServer: false,

  data() {
    return {
      snack: false,
      snackColor: '',
      snackText: '',
      expanded: [],
      editedIndex: -1,
      orgDefaults: {
        name: '',
        roles: ['doctor']
      },
      interval: intervals[0].value,
      intervals,
      org: {
        name: '',
        roles: ['doctor']
      },
      orgHeaders: [
        {
          text: 'ID',
          value: 'id'
        },
        {
          text: 'Name',
          value: 'name'
        },
        {
          text: 'Parent Org',
          value: 'parentOrg'
        },
        {
          text: 'Roles',
          value: 'roles'
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false
        }
      ],
      showOrgModal: false,
      usageByCheckpointOptions: {
        chart: {
          title: 'Recent usage by Checkpoint',
          subtitle: 'Recent usage by Checkpoint',
          width: 400,
          is3D: true
        }
      }
    }
  },
  computed: {
    orgName() {
      return this.org ? this.org.name : 'All Orgs'
    },
    ...mapGetters({
      usageByCheckpoint: 'orgs/recentUsageByCheckpoint',
      user: 'users/user',
      orgs: 'orgs/orgs'
    }),
    usageByCheckpointData() {
      return this.usageByCheckpoint
    },
    rootOrgs() {
      return this.orgs && this.orgs.filter((org) => org.roles.includes('root'))
    }
  },
  methods: {
    ...mapActions({
      getUsageByCheckpoint: 'orgs/getRecentUsageByCheckpoint',
      getOrgs: 'orgs/getOrgs',
      deleteOrg: 'orgs/deleteOrg',
      saveOrg: 'orgs/saveOrg',
      getPatients: 'users/getPatients'
    }),
    ...mapMutations({
      setCurrentOrg: 'users/setOrg',
      setSelectedOrg: 'users/setSelectedOrg',
      setSnackbarText: 'setSnackbarText'
    }),
    itemExpanded({ item: org, value: expanded }) {
      if (!expanded) return

      this.orgRowSelected(org)
      this.getPatients({ hostOrgId: org.id })
    },
    getParentName(id) {
      const parent = this.orgs.find((org) => org.id === id)
      return parent && parent.name
    },

    async save(org) {
      if (org.roles.includes('root')) {
        this.setSnackbarText(`${org.name} not saved! # organization is immutable.`)
      } else {
        await this.saveOrg(org)
      }
      await this.getOrgs()
    },

    editItem(item) {
      this.editedIndex = this.orgs.indexOf(item)
      this.org = Object.assign({}, item)
      this.showOrgModal = true
    },
    async deleteItem(item) {
      const index = this.orgs.indexOf(item)
      const ok = await this.$confirm('Are you sure you want to delete this organization?', { title: 'Warning' })
      if (ok) {
        await this.deleteOrg(item.id)
        this.orgs.splice(index, 1)
        this.org = { ...this.orgDefaults }
      }
    },
    orgRowSelected(org) {
      this.org = org
      this.setSelectedOrg(org)
      this.setCurrentOrg(org)
      this.fetchUsage()
    },
    intervalSelected(event) {
      this.interval = event
      this.fetchUsage()
    },
    orgModalClose(event) {
      this.showOrgModal = false
    },
    async orgModalSave(event) {
      console.log('got here 1?')
      this.org = await this.save(event)
      this.showOrgModal = false
    },
    fetchUsage() {
      const arg = { org: this.org, ...this.interval }
      this.getUsageByCheckpoint(arg)
    }
  },
  watch: {
    showOrgModal() {
      if (!this.showOrgModal) {
        this.$nextTick(() => {
          this.org = { ...this.orgDefaults }
          this.editedIndex = -1
        })
      }
    }
  }
}
</script>
