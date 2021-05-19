import Vue from 'vue'
import VCalendar from 'v-calendar'

// Use v-calendar & v-date-picker components
Vue.use(VCalendar, {
  componentPrefix: 'medcreds' // Use <vc-calendar /> instead of <v-calendar />
})
