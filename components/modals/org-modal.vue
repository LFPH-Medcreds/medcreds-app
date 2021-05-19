<template>
  <div data-app>
    <v-dialog v-model="showDialog" persistent max-width="600px" :fullscreen="$vuetify.breakpoint.xsOnly" id="orgDialog">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark class="mb-2" v-on="on" id="newOrgButton">New Org</v-btn>
      </template>
      <v-card id="editOrgCard" class="py-1">
        <v-card-title>
          <Logo :title="org.name" :modalTitle="true" />
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="10" offset-sm="1">
                <v-text-field v-model="org.name" label="Name" outlined autofocus :append-icon="getNameIcon(org.name)" id="orgName" />
              </v-col>
              <v-col cols="12" sm="10" offset-sm="1">
                <v-text-field
                  v-model="org.email"
                  autocomplete="false"
                  label="Email"
                  outlined
                  :append-icon="getEmailIcon(org.email, false)"
                  id="orgEmail"
                />
              </v-col>
              <v-col cols="12" sm="10" offset-sm="1">
                <v-select v-model="roles" label="Roles" :items="validRoles" multiple outlined>
                  <template v-slot:selection="{ item }">
                    <v-chip class="ma-1 py-4 px-2">
                      <span>{{ item }}</span>
                    </v-chip>
                  </template>
                </v-select>
              </v-col>
              <v-col cols="12" sm="10" offset-sm="1" v-if="hasRootRole">
                <v-text-field
                  v-model="apiKey"
                  type="text"
                  autocomplete="false"
                  label="API Key"
                  outlined
                  :append-icon="getPasswordIcon(apiKey)"
                  id="orgApiKey"
                />
              </v-col>
              <v-col cols="12" sm="10" offset-sm="1" v-if="hasRootRole">
                <v-text-field
                  v-model="subscriptionId"
                  type="text"
                  autocomplete="false"
                  label="Subscription ID"
                  outlined
                  :append-icon="getPasswordIcon(subscriptionId)"
                  id="orgSubscriptionId"
                />
              </v-col>
              <v-col cols="12" sm="10" offset-sm="1" v-if="hasRootRole">
                <v-text-field
                  v-model="tenantId"
                  type="text"
                  autocomplete="false"
                  label="Tenant ID"
                  outlined
                  :append-icon="getPasswordIcon(tenantId)"
                  id="orgTenantId"
                />
              </v-col>
              <v-col cols="12" sm="10" offset-sm="1" v-if="hasRootRole">
                <v-select ref="orgPolicy" label="Verification Policy ID" :items="policies" v-model="policy" :async-loading="!policy" />
              </v-col>
              <v-col cols="12" sm="10" offset-sm="1" v-if="hasRootRole">
                <v-select
                  ref="orgDefinition"
                  label="Credential Definition ID"
                  :items="definitions"
                  :async-loading="!definitionId"
                  v-model="definitionId"
                />
              </v-col>
            </v-row>
            <transition name="fade-transition">
              <v-row v-show="orgError.length">
                <v-col>
                  <span class="red--text subheading" id="orgError">
                    <center>
                      {{ orgError }}
                    </center>
                  </span>
                </v-col>
              </v-row>
            </transition>
          </v-container>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" ref="closeButton" @click="showDialog = false"> Close </v-btn>
          <v-btn color="primary darken-1" ref="saveButton" :loading="fetching" @click="onClickSave" :disabled="!formValid">
            <span v-if="!fetching">Save</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import global from '@/mixins/global'
import Logo from '@/components/logo'
import validator from 'validator'

export default {
  mixins: [global],
  components: {
    Logo
  },
  props: {
    org: {
      type: Object,
      default: () => ({
        roles: ['doctor']
      })
    },
    show: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapGetters({
      orgError: 'orgs/orgError',
      orgs: 'orgs/orgs',
      credentialDefinitions: 'ssi/credentialDefinitions',
      verificationPolicies: 'ssi/verificationPolicies'
    }),

    hasRootRole() {
      const { org } = this
      return org && org.roles && org.roles.includes('root')
    },

    validRoles() {
      return ['doctor', 'verifier', 'root']
    },

    definitions() {
      if (this.credentialDefinitions) {
        return this.credentialDefinitions.map((it) => ({
          text: `${it.name} ${it.version}`,
          value: it.definitionId
        }))
      }
    },
    policies() {
      if (this.verificationPolicies) {
        return this.verificationPolicies.map((it) => ({
          text: `${it.name} ${it.version}`,
          value: it.policyId
        }))
      }
    },
    definitionId: {
      get: function () {
        return this.getStreetcredProp('definitionId') || (this.definitions && this.definitions.length && this.definitions[0].id)
      },
      set: function (val) {
        this.setStreetcredProp('definitionId', val)
      }
    },
    policyId: {
      get: function () {
        return this.getStreetcredProp('policyId') || (this.policies && this.policies.length && this.policies[0].id)
      },
      set: function (val) {
        this.setStreetcredProp('policyId', val)
      }
    },
    policy: {
      get() {
        const policyId = this.getStreetcredProp('policyId') || (this.policies && this.policies.length && this.policies[0].id)
        const policy = this.policies && this.policies.find((policy) => policy.value === policyId)
        return policy || {}
      },
      set(val) {
        this.setStreetcredProp('policyId', val)
      }
    },
    roles: {
      get: function () {
        return this.org && this.org.roles
      },
      set: function (val) {
        this.org.roles = val
      }
    },
    apiKey: {
      get: function () {
        return this.getStreetcredProp('apiKey')
      },
      set: function (val) {
        this.setStreetcredProp('apiKey', val)
      }
    },
    tenantId: {
      get: function () {
        return this.getStreetcredProp('tenantId')
      },
      set: function (val) {
        this.setStreetcredProp('tenantId', val)
      }
    },
    subscriptionId: {
      get: function () {
        return this.getStreetcredProp('subscriptionId')
      },
      set: function (val) {
        this.setStreetcredProp('subscriptionId', val)
      }
    },
    showDialog: {
      get: function () {
        return this.show
      },
      set: function (val) {
        if (val) {
          this.$emit('open')
        } else {
          this.$emit('close')
        }
      }
    },
    formValid() {
      const { org, roles, getNameIcon, subscriptionId, tenantId, apiKey } = this
      const { name, email } = org

      return (
        getNameIcon(name) === 'mdi-check' &&
        roles.length &&
        (!email || validator.isEmail(email)) &&
        (!this.hasRootRole || (subscriptionId && tenantId && apiKey))
      )
    }
  },

  async mounted() {
    if (this.org && this.org.id) {
      await this.fetchDefinitions({ hostOrgId: this.org.id })
      await this.fetchPolicies(this.org.id)
      this.$forceUpdate()
    }
  },

  methods: {
    ...mapActions({
      'fetchDefinitions': 'ssi/getCredentialDefinitions',
      'fetchPolicies': 'ssi/listVerificationPolicies'
    }),
    onClickSave() {
      this.$emit('save', this.org)
    },
    getStreetcredProp(key) {
      return this.org && this.org.config && this.org.config.streetcred && this.org.config.streetcred[key]
    },
    setStreetcredProp(key, val) {
      if (!this.org.config) {
        this.org.config = {}
      }
      if (!this.org.config.streetcred) {
        this.org.config.streetcred = {}
      }
      this.org.config.streetcred[key] = val
    }
  },

  watch: {
    async org() {
      if (this.org && this.org.id) {
        await this.fetchDefinitions({ hostOrgId: this.org.id })
        await this.fetchPolicies(this.org.id)
        this.$forceUpdate()
      }
    }
  }
}
</script>
