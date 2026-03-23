import localData from '@/static/data/hervoice_quotes_2026.json'

const CLOUD_DATA_URL = 'https://hu.witplay.com/data/hervoice_quotes_2026.json'

function normalizeEntries(raw) {
  if (!Array.isArray(raw)) return []
  return raw
    .filter((item) => item && item.date && item.quote && item.teacher_note)
    .sort((a, b) => a.date.localeCompare(b.date))
}

export function getLocalEntries() {
  return normalizeEntries(localData)
}

export async function fetchEntries() {
  const local = getLocalEntries()
  return new Promise((resolve) => {
    uni.request({
      url: CLOUD_DATA_URL,
      timeout: 6000,
      success: (res) => {
        const cloud = normalizeEntries(res.data)
        resolve(cloud.length ? cloud : local)
      },
      fail: () => resolve(local)
    })
  })
}
