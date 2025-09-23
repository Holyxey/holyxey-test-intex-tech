export type CarInfo = {
  id: number
  make: string
  model: string
  year: number
  trims?: Record<string, string>[]
  photo?: string
}
