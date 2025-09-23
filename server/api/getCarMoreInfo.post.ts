import type { CarInfo } from '@@/types'

const origins = [
  'http://localhost:3000',
  'https://intex.yurin.dev',
  'https://cloudflared.holyxey.com',
]

async function fetchCarInfo(car: CarInfo): Promise<CarInfo['trims'] | undefined> {
  const url = `https://www.carqueryapi.com/api/0.3/?cmd=getTrims&make=${car.make}&year=${car.year}&model=${car.model}`
  const data = await $fetch<{ Trims: { [key: string]: string }[] }>(url)
  if (data && data.Trims && data.Trims.length > 0) {
    return data.Trims
  }
  return undefined
}

export default defineEventHandler(async (event) => {
  const origin = getHeader(event, 'origin')
  const body = await readBody(event)

  if (!body.car) {
    throw createError({ statusCode: 400, statusMessage: 'No car specified' })
  }

  // Проверка CORS
  if (origin && origins.includes(origin)) {
    setResponseHeaders(event, {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    })
  } else {
    event.node.res.statusCode = 403
    return 'Access denied'
  }
  if (event.method === 'OPTIONS') return ''

  // Основная логика
  return await fetchCarInfo(body.car)
})
