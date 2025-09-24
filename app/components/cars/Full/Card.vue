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
  <div>
    <!-- Card Hero -->
    <div v-if="car" class="flex flex-col gap-x-10 gap-y-4 pb-6 md:flex-row">
      <!-- Titles & status -->
      <CarsFullSection class="flex flex-1 flex-col gap-6 overflow-hidden">
        <!-- Header -->
        <h1 class="my-auto w-full items-center gap-2 text-2xl font-bold">
          {{ car.make }} {{ car.model }}
        </h1>

        <!-- Local info -->
        <div class="flex flex-1 flex-col gap-4 font-semibold">
          <CarsFullLine left="Year" :right="car.year" />
          <CarsFullLine left="Make" :right="car.make" />
          <CarsFullLine left="Model" :right="car.model" />
        </div>

        <!-- Pick info -->
        <div
          v-if="!trims || pending"
          key="status-info"
          :class="[
            'flex items-center',
            'ease-cubic -m-4 p-4 text-center transition-all',
            'relative cursor-pointer bg-blue-400 shadow-none select-none',
            !trims || pending ? 'min-h-15' : 'min-h-12',
          ]"
          @click="chosenList.size ? chosenList.clear() : null"
        >
          <TransitionGroup appear name="page">
            <p v-if="pending" key="pending" class="absolute top-1/2 -translate-y-1/2">
              Загружаю информацию
            </p>

            <div v-else-if="!trims" key="error-fetch" class="absolute top-1/2 -translate-y-1/2">
              <p>Дополнительная информация не найдена</p>
              <p>Попробуйте обновить страницу</p>
            </div>
          </TransitionGroup>
        </div>
      </CarsFullSection>

      <!-- Image -->
      <CarsFullSection class="rounded-4xl bg-none shadow-none">
        <img
          v-if="photo"
          class="aspect-[16/9] rounded-2xl object-cover"
          :src="photo"
          :alt="`${car.make} ${car.model} ${car.year}`"
        />
      </CarsFullSection>
    </div>

    <!-- Trims Cols -->
    <div v-if="car" :class="['grid gap-x-10 gap-y-4 md:grid-cols-2']">
      <!-- First col -->
      <TransitionGroup appear tag="div" name="page" :class="['flex h-fit flex-col gap-y-4']">
        <!-- Trims even -->
        <CarsFullTrim v-for="(trim, key) in trimsEven" :key="`trim-even-${key}`" :trim />
      </TransitionGroup>

      <!-- Second col -->
      <TransitionGroup appear tag="div" name="page" :class="['flex h-fit flex-col gap-4']">
        <!-- Trims odd -->
        <CarsFullTrim v-for="(trim, key) in trimsOdd" :key="`trim-odd-${key}`" :trim />
      </TransitionGroup>
    </div>
  </div>
</template>
