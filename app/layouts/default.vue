<script setup lang="ts">
  import { Icon } from '@iconify/vue'
  const hasBack = reactive(() => useRouter().options.history.state.back)
  const isHomePage = reactive(() => useRoute().path === '/')

  const showButton = reactive(() => {
    return !!hasBack() || !isHomePage()
  })

  async function goBack() {
    if (hasBack()) {
      useRouter().back()
    } else {
      await navigateTo('/')
    }
  }
</script>

<template>
  <div class="mx-auto max-w-7xl p-4">
    <header
      :class="['ease-cubic transition-all', 'sticky top-2 z-10 mb-4 flex', showButton() && 'gap-5']"
    >
      <button
        :class="[
          'ease-cubic m-auto cursor-pointer transition-all duration-300',
          'active:scale-90',
          'flex items-center gap-2 rounded-full bg-stone-200 text-stone-900',
          showButton() ? 'p-3.5 shadow-xl' : 'h-0 w-0 translate-x-3 scale-50 p-0 opacity-0',
        ]"
        @click="goBack"
      >
        <Icon
          class="m-auto"
          width="20"
          :icon="hasBack() ? 'solar:backspace-line-duotone' : 'solar:home-smile-angle-line-duotone'"
        />
      </button>

      <CarsSearch class="flex-1" type="text" placeholder="Введите искомый параметр" />
    </header>

    <slot />
  </div>
</template>
