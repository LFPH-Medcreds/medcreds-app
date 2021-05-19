<template>
  <transition-group name="fade">
    <v-card key="users-table" :class="{ 'ma-5': !$vuetify.breakpoint.xsOnly }">
      <v-toolbar color="blue" dark :class="{ 'mt-5': $vuetify.breakpoint.smAndUp }">
        <v-toolbar-title style="white-space: unset !important">
          <div class="pt-3 mb-3 web">User Management</div>
          <div class="pt-3 mb-3 mobile subtitle-1">User Management</div>
        </v-toolbar-title>
        <v-spacer />

        <IconButton
          tool-tip="Add new user to organization"
          id="add-user"
          icon="mdi-account-multiple-plus"
          @click="toggleInvite2OrgModal()"
        />

        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details />
      </v-toolbar>
      <v-card-subtitle class="subtitle-1">
        {{ selectedOrg && selectedOrg.name }}
      </v-card-subtitle>
      <v-card-actions> </v-card-actions>
      <v-data-table
        :headers="headers"
        :items="patients"
        :loading="$fetchState.pending && !patients.length"
        :loading-text="`Loading ${hostOrgName} Users`"
        sort-by="todayTotal"
        :sort-desc="true"
        must-sort
        flat
        item-key="email"
        :footer-props="{ 'items-per-page-options': [20, 50, -1] }"
        :search="search"
        class="pa-1"
      >
        <template v-slot:item="{ item: patient, index: i }">
          <tr>
            <td>
              <div>
                {{ patient.name }}
              </div>
            </td>
            <td v-if="!$vuetify.breakpoint.xsOnly">
              <div style="font-size: 12px">
                {{ patient.email }}
              </div>
            </td>

            <td>
              <div style="text-align: center">
                <v-select
                  class="mt-5"
                  style="max-width: 250px"
                  @input="patchOrgUser({ hostOrgId, user: patient })"
                  v-model="patient.orgRoles[hostOrgId]"
                  :items="validRoles"
                  multiple
                >
                  <template v-slot:selection="{ item }">
                    <v-chip>
                      <span>{{ item }}</span>
                    </v-chip>
                  </template>
                </v-select>
              </div>
            </td>
            <td>
              <div style="text-align: center">
                <v-btn
                  @click="
                    deleteUser(hostOrgId, patient)
                    index = i
                  "
                  :loading="fetching && i === index"
                  :disabled="fetching && i === index"
                  icon
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </transition-group>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import IconButton from '@/components/icon-button'
import selectedOrgMixin from '@/mixins/selectedOrg'

export default {
  async fetch() {
    const { hostOrgId, getPatients } = this
    await getPatients({ hostOrgId })
  },

  components: {
    IconButton
  },

  fetchOnServer: false,

  watch: {
    patients() {}
  },

  mixins: [selectedOrgMixin],

  data() {
    return {
      filter: {},
      friends: [],
      sortDesc: false,
      expanded: [],
      index: -1,
      search: '',
      headers: [
        { text: 'Name', align: 'left', value: 'name' },
        { text: 'Email', align: 'left', value: 'email' },
        { text: 'Roles', align: 'center', value: 'rolses' },
        { text: 'Remove', align: 'center' }
      ]
    }
  },
  computed: {
    ...mapGetters({
      user: 'users/user',
      fetching: 'fetching',
      patients: 'users/patients',
      activePatient: 'users/activePatient'
    }),
    validRoles() {
      return ['admin', ...this.selectedOrg.roles]
    }
  },
  methods: {
    ...mapMutations({
      setActivePatient: 'users/setActivePatient',
      toggleInvite2OrgModal: 'users/toggleInvite2OrgModal'
    }),
    ...mapActions({
      getPatients: 'users/getPatients',
      patchOrgUser: 'users/patchOrgUser',
      deleteOrgUser: 'users/deleteOrgUser'
    }),
    async deleteUser(hostOrgId, user) {
      const ok = await this.$confirm('Are you sure you want to remove this user?', { title: 'Warning' })
      if (ok) {
        this.deleteOrgUser({ hostOrgId, user })
      }
    }
  }
}
</script>
