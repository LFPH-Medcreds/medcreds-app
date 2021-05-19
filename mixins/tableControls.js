import { mapMutations } from 'vuex'
import MassEmailModal from '@/components/modals/mass-email-modal'

export default {
  async fetch() {
    const { hostOrgId, getPatients } = this
    await getPatients({ hostOrgId })
  },
  fetchOnServer: false,

  components: {
    MassEmailModal
  },
  data() {
    return {
      creds: {},
      filter: {},
      sortDesc: false,
      expanded: [],
      selected: [],
      search: '',
      headers: [
        {
          text: 'name',
          align: 'left',
          value: 'name'
        },
        {
          text: 'email',
          align: 'left',
          value: 'email'
        },
        {
          text: 'proofs today',
          align: 'left',
          value: 'todayTotal'
        },
        {
          text: 'contact',
          align: 'center'
        }
      ]
    }
  },
  methods: {
    ...mapMutations({
      toggleMassEmailModal: 'users/toggleMassEmailModal'
    })
  },
  computed: {
    selectedUsers() {
      return this.selected.map(({ email, name, phone }) => {
        return { email, name, phone }
      })
    }
  }
}
