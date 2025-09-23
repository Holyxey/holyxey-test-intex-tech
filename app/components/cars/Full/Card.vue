<script setup lang="ts">
  import { Icon } from '@iconify/vue'

  const route = useRoute()
  const id = route.params.id

  const carsStore = useCarsStore()
  const car = carsStore.get(Number(id))

  const { data: photo } = useAsyncData(`car-photo-${id}`, async () => {
    if (car) {
      return await useCarsApi.getPhoto(car)
    }
    return null
  })
  const { data: moreInfo, pending } = useAsyncData(`car-info-${id}`, async () => {
    if (car) {
      return await useCarsApi.getTrims(car)
    }
    return null
  })

  const trimsEven = computed(() => {
    if (moreInfo.value && Array.isArray(moreInfo.value) && moreInfo.value.length) {
      return moreInfo.value.filter((_, index) => index % 2 === 0)
    }
    return []
  })
  const trimsOdd = computed(() => {
    if (moreInfo.value && Array.isArray(moreInfo.value) && moreInfo.value.length) {
      return moreInfo.value.filter((_, index) => index % 2 !== 0)
    }
    return []
  })

  //
  const chosenList = ref(new Set<string>())
  provide('chosen', chosenList)
</script>

<template>
  <div v-if="car" :class="['grid gap-x-10 gap-y-4 md:grid-cols-2']">
    <!-- First col -->
    <TransitionGroup appear tag="div" name="page" :class="['flex h-fit flex-col gap-y-4']">
      <!-- Header -->
      <div key="header" class="sticky top-2 z-2 flex flex-col gap-4 bg-stone-100 md:flex-row">
        <NuxtLink
          to="/"
          class="flex items-center gap-4 rounded-full bg-stone-600 px-4 py-2 text-white"
        >
          <Icon
            width="20"
            :icon="pending ? 'hugeicons:loading-03' : 'solar:backspace-line-duotone'"
            :class="[pending && 'animate-spin']"
          />
          <span>Назад</span>
        </NuxtLink>

        <h1 class="my-auto flex items-center gap-2 text-2xl font-bold">
          <span>{{ car.make }}</span>
          <span>{{ car.model }}</span>
        </h1>
      </div>

      <!-- Local info -->
      <CarsFullSection key="local-info" class="font-semibold">
        <CarsFullLine left="Year" :right="car.year" />
        <CarsFullLine left="Make" :right="car.make" />
        <CarsFullLine left="Model" :right="car.model" />
      </CarsFullSection>

      <CarsFullSection
        v-if="!chosenList.size && !pending"
        key="choose-hint"
        class="border border-dashed border-blue-500 bg-blue-200"
      >
        <p>Нажмите на пункт ниже для выделения</p>
      </CarsFullSection>

      <!-- Trims even -->
      <CarsFullTrim v-for="(trim, key) in trimsEven" :key="`trim-even-${key}`" :trim />

      <CarsFullSection v-if="pending" key="load-pending" class="bg-blue-400">
        <p class="text-lg font-semibold">Загружаю информацию</p>
      </CarsFullSection>

      <CarsFullSection v-else-if="!moreInfo" key="load-failed" class="bg-orange-400">
        <p class="text-lg font-semibold">Дополнительная информация не найдена</p>
        <p class="text-lg font-semibold">Попробуйте обновить страницу</p>
      </CarsFullSection>
    </TransitionGroup>

    <!-- Second col -->
    <TransitionGroup appear tag="div" name="page" :class="['flex h-fit flex-col gap-4']">
      <CarsFullSection v-if="photo" key="card-photo" class="overflow-hidden p-0!">
        <img
          class="block aspect-[16/9] object-cover"
          :src="photo"
          :alt="`${car.make} ${car.model} ${car.year}`"
        />
      </CarsFullSection>

      <!-- Trims odd -->
      <CarsFullTrim v-for="(trim, key) in trimsOdd" :key="`trim-odd-${key}`" :trim />
    </TransitionGroup>
  </div>
</template>
