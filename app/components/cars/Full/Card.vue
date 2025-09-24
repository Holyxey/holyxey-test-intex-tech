<script setup lang="ts">
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
  const { data: trims, pending } = useAsyncData(`car-info-${id}`, async () => {
    if (car) {
      return await useCarsApi.getTrims(car)
    }
    return null
  })

  const trimsEven = computed(() => {
    if (trims.value && Array.isArray(trims.value) && trims.value.length) {
      return trims.value.filter((_, index) => index % 2 === 0)
    }
    return []
  })
  const trimsOdd = computed(() => {
    if (trims.value && Array.isArray(trims.value) && trims.value.length) {
      return trims.value.filter((_, index) => index % 2 !== 0)
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
      <div key="header" class="z-2 flex flex-col gap-4 px-4 text-center md:flex-row">
        <h1 class="my-auto w-full items-center gap-2 text-2xl font-bold">
          {{ car.make }} {{ car.model }}
        </h1>
      </div>

      <!-- Local info -->
      <CarsFullSection key="local-info" class="font-semibold">
        <CarsFullLine left="Year" :right="car.year" />
        <CarsFullLine left="Make" :right="car.make" />
        <CarsFullLine left="Model" :right="car.model" />
      </CarsFullSection>

      <!-- Pick info -->
      <CarsFullSection
        key="status-info"
        :class="[
          'ease-cubic transition-all',
          'relative cursor-pointer bg-stone-200 shadow-none select-none',
          !trims || pending ? 'min-h-15' : 'min-h-12',
        ]"
        @click="chosenList.size ? chosenList.clear() : null"
      >
        <TransitionGroup appear name="page">
          <p v-if="pending" class="absolute top-1/2 -translate-y-1/2">Загружаю информацию</p>

          <div v-else-if="!trims" class="absolute top-1/2 -translate-y-1/2">
            <p>Дополнительная информация не найдена</p>
            <p>Попробуйте обновить страницу</p>
          </div>

          <p v-else-if="!chosenList.size" key="true" class="absolute top-1/2 -translate-y-1/2">
            Нажмите на пункт ниже для выделения
          </p>
          <p v-else key="false" class="absolute top-1/2 -translate-y-1/2">Нажмите чтобы очистить</p>
        </TransitionGroup>
      </CarsFullSection>

      <!-- Trims even -->
      <CarsFullTrim v-for="(trim, key) in trimsEven" :key="`trim-even-${key}`" :trim />
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
