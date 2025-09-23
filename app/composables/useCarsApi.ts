import type { CarInfo } from '~~/types'

const useCarsApi = {
  async getPhoto(car: CarInfo) {
    if (import.meta.server) return
    const carsStore = useCarsStore()

    const storedCar = carsStore.get(car.id)
    if (storedCar?.photo) {
      return storedCar.photo
    }

    const foundPhoto = await $fetch('/api/getCarImg', {
      method: 'POST',
      body: { car },
    })

    if (foundPhoto) carsStore.savePhoto(car.id, foundPhoto)
    else carsStore.savePhoto(car.id, '')
    return foundPhoto
  },
  async getTrims(car: CarInfo) {
    if (import.meta.server) return
    const carsStore = useCarsStore()

    const storedCar = carsStore.get(car.id)
    if (storedCar?.trims) {
      return storedCar.trims
    }

    const foundMoreInfo = await $fetch<CarInfo['trims']>('/api/getCarMoreInfo', {
      method: 'POST',
      body: { car },
    })

    if (foundMoreInfo) carsStore.saveMoreInfo(car.id, foundMoreInfo)
    else carsStore.saveMoreInfo(car.id, undefined)
    return foundMoreInfo
  },
}

//
export default useCarsApi
