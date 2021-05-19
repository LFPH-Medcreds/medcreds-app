import moment from 'moment'

export const strict = false

export const state = () => ({
  meetings: [],
  meeting: null,
  users: {},
  invitation: {}
})

export const getters = {
  meetings: (state) => state.meetings,
  meeting: (state) => state.meeting,
  users: (state) => state.users,
  invitation: (state) => state.invitation
}

export const mutations = {
  setMeetings(state, meetings) {
    state.meetings = meetings
  },
  setMeeting(state, meeting) {
    state.meeting = meeting
  },
  users(state, users) {
    state.users = users
  },
  invitation(state) {
    state.invitation = state.invitation
  }
}

export const actions = {
  async listUsers({ commit }) {
    const { data } = await this.$axios.get('/zoom/users')
    commit('setUsers', data)
  },
  async listMeetings({ commit }, params) {
    const { zoomUserId } = params
    const { data } = await this.$axios.get(`/zoom/users/${zoomUserId}/meetings`)
    commit('setMeetings', data)
  },
  async createMeeting({ commit }, params) {
    const { zoomUserId, duration, title, start_time } = params
    const { data } = await this.$axios.post(`/zoom/users/${zoomUserId}/meetings`, {
      title,
      duration,
      start_time
    })
    commit('setMeeting', data.details)
  },
  async getMeetingDetails({ commit }, params) {
    const { meetingId } = params
    const { data } = await this.$axios.get(`/zoom/meetings/${meetingId}`)
    commit('setMeeting', data)
  },
  async getMeetingInvitation({ commit }) {
    const { meetingId } = params
    const { data } = await this.$axios.get(`/zoom/meetings/${meetingId}/invitation`)
    commit('setInvitation', data)
  }
}
