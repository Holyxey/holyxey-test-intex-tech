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
      'flex flex-1 flex-col',
      'cursor-pointer',
      'ease-cubic transition-all',
      'active:scale-99',
    ]"
    @mousedown="openCar"
  >
    <div :class="['flex flex-col gap-2 truncate rounded-t-lg rounded-b-sm px-2 py-1']">
      <h1 class="flex items-center gap-4 font-medium">
        <span class="text-lg">{{ car.make }}</span>
        <span class="mt-auto">{{ car.model }}</span>
        <span class="ms-auto">{{ car.year }}</span>
      </h1>
    </div>

    <div class="overflow-hidden rounded-2xl">
      <img
        :src="photo"
        loading="lazy"
        :class="[
          'aspect-[16/9] w-full flex-1 object-cover select-none',
          'ease-cubic transition-all duration-500',
          'pointer-events-none z-0 bg-stone-200',
          'group-hover/preview:scale-105',
          'group-active/preview:scale-100',
          photo === placeholder ? 'blur-xs grayscale-100' : '',
        ]"
        :alt="`${car.make} ${car.model}`"
      />
    </div>
  </article>
</template>
