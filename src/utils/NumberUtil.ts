export const secondsToString = (sec: number, max_sec: number | undefined) => {
  const formatTimeUnit = (unit: number) => ('0' + unit).slice(-2)

  const maxHourCheck = max_sec ? Math.floor(max_sec / 3600) : 0
  const hours = Math.floor(sec / 3600)
  const minutes = Math.floor((sec % 3600) / 60)
  const seconds = sec % 60

  return (maxHourCheck < 1 ? '' : formatTimeUnit(hours) + ':') + formatTimeUnit(minutes) + ':' + formatTimeUnit(seconds)
}
