<script setup lang="ts">
  import type { CarInfo } from '@@/types'

  const props = defineProps<{ car: CarInfo }>()

  const placeholder = '/images/cars/placeholder.jpg'
  const photo = ref(placeholder)

  async function openCar() {
    await navigateTo(`/car-${props.car.id}`)
  }

  onMounted(() => {
    useCarsApi.getPhoto(props.car).then((uploaded) => {
      photo.value = uploaded || placeholder
    })
  })
</script>

<template>
  <article
    :class="[
      'group/preview',
      'min-w-xs flex-1',
      'flex flex-col',
      'overflow-hidden rounded-2xl bg-white shadow-md',
      'ease-cubic transition-all',
      'active:scale-99',
    ]"
    @mousedown="openCar"
  >
    <div :class="['flex flex-col gap-2 rounded-t-lg rounded-b-sm px-4 py-1']">
      <h1 class="flex items-center gap-4 font-medium">
        <span class="text-lg">{{ car.make }}</span>
        <span class="mt-auto">{{ car.model }}</span>
        <span class="ms-auto">{{ car.year }}</span>
      </h1>
    </div>

    <div class="overflow-hidden">
      <img
        :src="photo"
        loading="lazy"
        :class="[
          'ease-cubic transition-all duration-500',
          'group-hover/preview:scale-105',
          'group-active/preview:scale-100',
          'pointer-events-none z-0 bg-stone-200',
          'aspect-[16/9] w-full flex-1 object-cover select-none',
          photo === placeholder ? 'animate-pulse blur-xs' : '',
        ]"
        :alt="`${car.make} ${car.model}`"
      />
    </div>

    <NuxtLink
      :to="`/car-${car.id}`"
      :class="[
        'block flex-1 rounded-b-lg bg-stone-700 p-2',
        'text-center text-sm font-semibold text-white uppercase',
        'transition-all group-hover/preview:bg-stone-800 hover:bg-stone-900',
        'cursor-pointer',
      ]"
    >
      More info
    </NuxtLink>
  </article>
</template>
