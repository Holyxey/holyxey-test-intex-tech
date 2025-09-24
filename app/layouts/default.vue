<script setup lang="ts">
  import { Icon } from '@iconify/vue'
  import { Icons } from '@/constants/icons'
  const hasBack = ref<string>(useRouter().options.history.state.back?.toString() || '')
  const isHomePage = ref<boolean>(useRoute().path === '/')

  const showButton = ref(!!hasBack.value || !isHomePage.value)

  async function goBack() {
    if (hasBack.value) {
      useRouter().back()
    } else {
      await navigateTo('/')
    }
  }

  watch(
    () => useRoute().path,
    (newPath) => {
      isHomePage.value = newPath === '/'
      hasBack.value = useRouter().options.history.state.back?.toString() || ''
      showButton.value = !!hasBack.value || !isHomePage.value
    },
  )
</script>

<template>
  <div class="mx-auto max-w-7xl p-4">
    <header
      :class="['ease-cubic transition-all', 'sticky top-2 z-10 mb-4 flex', showButton && 'gap-2']"
    >
      <button
        :class="[
          'ease-cubic m-auto cursor-pointer transition-all duration-300',
          'active:scale-90',
          'flex items-center gap-2 rounded-full bg-stone-200 text-stone-900',
          showButton ? 'p-3.5' : 'h-0 w-0 translate-x-3 scale-50 p-0 opacity-0',
        ]"
        @click="goBack"
      >
        <Icon class="m-auto" width="20" :icon="hasBack ? Icons.Back : Icons.Home" />
      </button>

      <CarsSearch class="flex-1" type="text" placeholder="Поиск и фильтр" />
      <SearchSuggestions />
    </header>

    <slot />
  </div>
</template>
