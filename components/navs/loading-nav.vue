<template>
  <v-navigation-drawer v-model="drawer" permanent :right="true" v-if="$vuetify.breakpoint.smAndUp" app>
    <v-layout column fill-height align-start justify-start>
      <v-list width="100%">
        <v-skeleton-loader
          type="list-item-avatar"
          class="px-2 gray-border-bottom"
          :style="{ height: $vuetify.breakpoint.mdAndUp ? '56px' : $vuetify.breakpoint.smOnly ? '45px' : '40px' }"
        />
      </v-list>

      <v-list dense width="100%">
        <v-subheader v-if="!mini">
          <v-skeleton-loader type="list-item" tile class="mx-auto" />
        </v-subheader>
        <v-skeleton-loader type="list-item-avatar-two-line" tile class="mx-auto" />
        <v-skeleton-loader type="list-item-avatar-two-line" tile class="mx-auto" />
      </v-list>
      <v-spacer />

      <v-list width="100%">
        <v-divider />
        <v-skeleton-loader type="list-item-avatar" class="px-2 gray-border-bottom" />
      </v-list>
    </v-layout>
  </v-navigation-drawer>
</template>

<script>
  import { mapActions, mapGetters, mapMutations } from 'vuex'

  export default {
    components: {},
    props: {
      user: Object
    },
    mounted() {
      this.mini = !!this.$vuetify.breakpoint.smAndDown
    },
    methods: {
      ...mapMutations({}),
      ...mapActions({})
    },
    computed: {
      ...mapGetters({
        fetching: 'fetching'
      })
    },
    watch: {
      '$vuetify.breakpoint.smAndDown'(value) {
        this.mini = value
      }
    },
    data() {
      return {
        drawer: true,
        mini: false
      }
    }
  }
</script>
