import { DateTime } from 'luxon'

export const getPickerDate = (dateTime) => {
  const format = 'yyyy-MM-dd HH:mm'
  dateTime = dateTime === 'Invalid DateTime' ? null : `${dateTime}`
  if (dateTime && dateTime.length === '2020-05-12 19:24'.length) return dateTime
  if (dateTime && dateTime.length === '2020-05-12 07:39:00'.length) return dateTime.substr(0, dateTime.length - 3)
  if (dateTime) dateTime = dateTime.replace('T', ' ').replace('.000Z', '')

  const now = dateTime && dateTime !== 'undefined' ? DateTime.fromISO(dateTime) : DateTime.local()
  const formatted = now.toFormat(format)

  if (formatted === 'Invalid DateTime') {
    if (dateTime && dateTime.length === '2020-05-12 19:24'.length) return dateTime
    if (dateTime && dateTime.length === '2020-05-12 07:39:00'.length) return dateTime.substr(0, dateTime.length - 3)
  }
  return formatted
}
