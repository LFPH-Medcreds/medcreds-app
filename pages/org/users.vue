<template>
  <div>
    <transition name="fade-transition">
      <v-container fluid fill-height v-show="show1" class="animated">
        <v-col cols="12" justify="center">
          <transition name="fade-transition">
            <OrgUsers />
          </transition>
        </v-col>
      </v-container>
    </transition>
  </div>
</template>

<script>
  import global from '@/mixins/global'
  import OrgUsers from '@/components/tables/org-users'
  import selectedOrgMixin from '@/mixins/selectedOrg'

  export default {
    mixins: [global, selectedOrgMixin],

    components: {
      OrgUsers
    }
  }
</script>
