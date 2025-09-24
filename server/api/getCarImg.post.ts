import type { CarInfo } from '@@/types'

const config = useRuntimeConfig()

const headers = {
  'User-Agent': `${config.appName}/1.0 (${config.appEmail})`,
}
const origins = [
  'http://localhost:3000',
  'https://intex.yurin.dev',
  'https://cloudflared.holyxey.com',
]

//
async function getPhoto(car: CarInfo): Promise<string | undefined> {
  const fileName = await findFileName(car)
  if (!fileName) return undefined

  const photo = await $fetch(`https://api.wikimedia.org/core/v1/commons/file/${fileName}`, {
    headers,
  })

  if (
    typeof photo !== 'object' ||
    !photo ||
    !('preferred' in photo) ||
    typeof photo.preferred !== 'object' ||
    !photo.preferred ||
    !('url' in photo.preferred) ||
    typeof photo.preferred.url !== 'string'
  ) {
    return undefined
  }

  return photo.preferred.url
}

async function findFileName(car: CarInfo) {
  const url = `https://api.wikimedia.org/core/v1/commons/search/page?q=${car.make} ${car.model} ${car.year}&limit=1`
  const data = await $fetch(url, {
    headers,
  })

  if (
    typeof data === 'object' &&
    !!data &&
    'pages' in data &&
    Array.isArray(data.pages) &&
    data.pages.length > 0
  ) {
    const fileName = data?.pages?.[0]?.title

    if (typeof fileName === 'string' && fileName.length > 0) return fileName
  }
}

//
type Body = { car?: CarInfo }

export default defineEventHandler(
  async (event): Promise<string | undefined | 'Access denied' | ''> => {
    const origin = getHeader(event, 'origin')
    const body = (await readBody(event)) as Body

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
    const car: CarInfo = body.car!

    const photo = await getPhoto(car)

    return photo
  },
)
