import Vue from 'vue'
import moment from 'moment'
const { DateTime } = require('luxon')

Vue.filter('yesNo', (value) => {
  if (value == 'true') return 'Yes'
  else return 'No'
})

Vue.filter('prettyDate', (value) => {
  if (!value) return ''
  let date
  if (value.match('.')) {
    const vals = value.split('.')
    date = `${vals[0]}.0000000Z`
    date = vals[0]
  } else date = value

  date = new moment(date, 'YYYY-MM-DDTHH:mm').utc()
  const time = date.format('llll')
  return time
})

Vue.filter('prettyLocalDate', (value) => {
  if (!value) return ''

  let date
  if (value.match('.')) {
    const vals = value.split('.')
    date = `${vals[0]}.000`
  }

  const utc = DateTime.fromISO(date, { zone: 'utc' })
  const local = utc.toLocal()

  // debugger
  return local.toFormat('ccc, LLL d, h:mm a')
})

Vue.filter('utcAgo', (value) => {
  if (!value) return ''

  const utc = DateTime.fromISO(value, { zone: 'utc' })

  const local = utc.toLocal()

  return local.toRelative()
})

Vue.filter('prettyLocalCertDate', (value) => {
  return moment(value).format('LLL');
})
