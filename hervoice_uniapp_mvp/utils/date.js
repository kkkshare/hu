export function toDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function todayKey() {
  return toDateKey(new Date())
}

export function weekLabel(dateKey) {
  const day = new Date(dateKey).getDay()
  return `周${'日一二三四五六'[day]}`
}

export function findBestIndex(entries, targetKey) {
  if (!entries.length) return 0
  const exact = entries.findIndex((item) => item.date === targetKey)
  if (exact >= 0) return exact

  const target = targetKey.replace(/-/g, '')
  let fallback = 0
  for (let i = 0; i < entries.length; i += 1) {
    if (entries[i].date.replace(/-/g, '') <= target) {
      fallback = i
    }
  }
  return fallback
}
