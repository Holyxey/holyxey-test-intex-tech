import type { CarInfo } from '~~/types'

const useCarsApi = {
  async getPhoto(car: CarInfo): Promise<string | undefined> {
    if (import.meta.server) return undefined
    const carsStore = useCarsStore()

    const storedCar = carsStore.get(car.id)
    if (storedCar?.photo) {
      return storedCar.photo
    }

    const foundPhoto = await $fetch<string | undefined>('/api/getCarImg', {
      method: 'POST',
      body: { car },
    })

    if (foundPhoto) carsStore.savePhoto(car.id, foundPhoto)
    else carsStore.savePhoto(car.id, '')
    return foundPhoto
  },
  async getTrims(car: CarInfo): Promise<CarInfo['trims'] | undefined> {
    if (import.meta.server) return undefined
    const carsStore = useCarsStore()

    const storedCar = carsStore.get(car.id)
    if (storedCar?.trims) {
      return storedCar.trims
    }

    const foundMoreInfo = await $fetch<CarInfo['trims'] | string | undefined>(
      '/api/getCarMoreInfo',
      {
        method: 'POST',
        body: { car },
      },
    )

    if (foundMoreInfo && typeof foundMoreInfo !== 'string') {
      carsStore.saveMoreInfo(car.id, foundMoreInfo)
      return foundMoreInfo
    }
    carsStore.saveMoreInfo(car.id, undefined)
    return undefined
  },
}

//
export default useCarsApi
