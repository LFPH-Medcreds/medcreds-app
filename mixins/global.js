import { mapActions, mapGetters, mapMutations } from 'vuex'
import { mask } from 'vue-the-mask'
import validator from 'validator'

export default {
  transition: 'fade',

  data() {
    return {
      show1: false,
      show2: false,
      show3: false
    }
  },
  directives: {
    mask
  },
  computed: {
    ...mapGetters({
      fetching: 'fetching',
      user: 'users/user'
    }),

    intercomEnabled() {
      return localStorage.disableIntercom !== 'true'
    }
  },
  methods: {
    ...mapActions({
      getAsyncImages: 'getAsyncImages'
    }),
    ...mapMutations({
      setFetching: 'setFetching'
    }),
    getInitials(name) {
      if (!name || !name.includes(' ')) return ''
      let parts = name.trim().split(' ')
      let initials = ''
      try {
        if (parts && parts.length > 1)
          initials = parts
            .map((part) => {
              return part[0] || ''
            })
            .join('')
        return initials && initials.toUpperCase()
      } catch (e) {
        console.error(e)
        return 'JD'
      }
    },
    getNameIcon(name) {
      if (!name) return 'mdi-alert-circle-outline'
      if (name.length > 1) return 'mdi-check'
      return 'mdi-alert-circle-outline'
    },
    get2FAIcon(code) {
      if (!code) return 'mdi-alert-circle-outline'
      if (code.length > 4) return 'mdi-check'
      return 'mdi-alert-circle-outline'
    },
    getFullNameIcon(name) {
      if (!name || (name && !name.length)) return 'mdi-alert-circle-outline'
      try {
        if (name.trim) {
          const valid = name.replace(/[,\/#!$%\^&\*;:{}=_`~()0-9]/g, '')
          if (valid.length) {
            return 'mdi-check'
          }
          return 'mdi-alert-circle-outline'
        }
        return 'mdi-alert-circle-outline'
      } catch (e) {
        return 'mdi-alert-circle-outline'
      }
    },
    getPasswordIcon(password, password2) {
      if (!password) return 'mdi-alert-circle-outline'
      return 'mdi-check'
    },
    getPassword2Icon(password, password2) {
      if (!password2 || !password) return 'mdi-alert-circle-outline'
      if (password !== password2) return 'mdi-alert-circle-outline'
      return 'mdi-check'
    },
    getEmailIcon(email, required = true) {
      if (!email) {
        return required ? 'mdi-alert-circle-outline' : 'mdi-check'
      }

      if (email && validator.isEmail(email)) {
        return 'mdi-check'
      }
      return 'mdi-alert-circle-outline'
    },
    hasRole(user, role) {
      return user && user.roles && -1 !== user.roles.indexOf(role)
    },
    getSchema(credential) {
      const { schemaName, schemaVersion } = credential
      debugger
      return `${schemaName}:${schemaVersion}`
    },
    getSchemaName(credential) {
      const { schemaName } = credential
      return `${schemaName}`
    }
  },
  mounted() {
    this.getAsyncImages()
    setTimeout(() => {
      this.show1 = true
    }, 300)
    setTimeout(() => {
      this.show2 = true
    }, 600)
    setTimeout(() => {
      this.show3 = true
    }, 900)
  }
}
