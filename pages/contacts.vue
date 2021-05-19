<template>
  <div>
    <transition name="fade-transition">
      <v-container fluid fill-height class="animated">
        <v-col cols="12" justify="center">
          <transition name="fade-transition">
            <Contacts v-if="user" />
          </transition>
        </v-col>
      </v-container>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import global from '@/mixins/global'
import Contacts from '@/components/tables/contacts'

export default {
  mixins: [global],

  components: {
    Contacts
  },

  computed: {
    ...mapGetters({
      user: 'users/user'
    })
  }
}
</script>
