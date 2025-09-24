<script setup lang="ts">
  import { Icon } from '@iconify/vue'
</script>

<template>
  <div class="mx-auto max-w-7xl p-4">
    <header class="sticky top-2 z-10 mb-4 flex gap-2">
      <NuxtLink
        to="/"
        class="flex w-12 items-center gap-2 rounded-full bg-stone-200 text-stone-900"
      >
        <Icon class="m-auto" width="20" icon="solar:backspace-line-duotone" />
      </NuxtLink>

      <CarsSearch class="flex-1" type="text" placeholder="Введите искомый параметр" />
    </header>
    <slot />
  </div>
</template>
