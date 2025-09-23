import { defineStore } from 'pinia'
import type { CarInfo } from '@@/types'
import LocalCars from '@/assets/data/cars.json'

export const useCarsStore = defineStore(
  'CarsStore',
  () => {
    const cars = ref<CarInfo[]>([])

    // Инициализируем данные только если store пустой
    if (cars.value.length === 0) {
      cars.value = LocalCars.map((car) => ({ ...car }))
    }

    function savePhoto(carId: number, photo: string) {
      const car = cars.value.find((c) => c.id === carId)
      if (car) {
        car.photo = photo
      }
    }

    function saveMoreInfo(carId: number, moreInfo: CarInfo['trims']) {
      const car = cars.value.find((c) => c.id === carId)
      if (car) {
        car.trims = moreInfo
      }
    }

    function get(id: number) {
      return cars.value.find((c) => c.id === id)
    }

    function getAll() {
      return cars.value
    }

    return {
      cars,
      get,
      getAll,
      savePhoto,
      saveMoreInfo,
    }
  },
  {
    persist: true,
  },
)
