<script setup lang="ts">
  import type { CarInfo } from '~~/types'

  const carsStore = useCarsStore()
  const list = computed(() => carsStore.getAll())

  const searchStore = useSearchStore()

  const isFoundedList = computed<CarInfo[]>(() => {
    if (!searchStore.value) return list.value
    return list.value.filter((car) => {
      const searchableCar = { ...car }
      delete searchableCar.photo
      delete searchableCar.trims
      return Object.values(searchableCar).some((v) =>
        new RegExp(searchStore.value!, 'ig').test(v.toString()),
      )
    })
  })
</script>

<template>
  <section>
    <TransitionGroup
      appear
      tag="div"
      name="page"
      class="grid gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
    >
      <CarsPreview
        v-for="(car, key) in list"
        v-show="isFoundedList.find((f) => f.id === car.id) || !searchStore"
        :key
        :car
      />
    </TransitionGroup>
  </section>
</template>
