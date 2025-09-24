<script setup lang="ts">
  import { Icon } from '@iconify/vue'
  const searchStore = useSearchStore()

  function toggle(category: string, suggestion: string) {
    searchStore.toggleFilter(category, suggestion)
  }

  function clearCategory(category: string) {
    searchStore.clearCategory(category)
  }
</script>

<template>
  <div
    v-if="Object.keys(searchStore.searchSuggestions).length"
    :class="[
      'ease-cubic transition-all duration-300',
      'absolute rounded-2xl bg-stone-200 shadow-xl backdrop-blur-xs',
      'right-0 left-0 max-h-[calc(100svh-100px)] p-4',
      'overflow-y-auto',
      searchStore.isSuggestionsOpened ? 'top-15' : 'pointer-events-none top-0 opacity-0',
    ]"
  >
    <div v-if="searchStore.searchSuggestions" class="flex flex-col gap-6">
      <div
        v-for="(category, key) in Object.entries(searchStore.searchSuggestions)"
        :key
        :class="['flex min-w-40 flex-1 flex-col items-start gap-2']"
      >
        <!-- filters Cat header -->
        <div class="flex items-center gap-2">
          <!-- trasn -->
          <div
            class="rounded-full bg-stone-300 p-2 text-stone-900"
            @pointerdown.stop.prevent="clearCategory(category[0])"
          >
            <Icon icon="solar:trash-bin-trash-line-duotone" />
          </div>

          <!-- Cat title -->
          <p class="font-semibold">{{ category[0] }}</p>
        </div>

        <!-- options list -->
        <ul class="flex flex-wrap gap-2">
          <li
            v-for="(suggestion, catKey) in category[1]"
            :key="suggestion || catKey"
            :class="[
              'min-w-fit flex-1 cursor-pointer rounded-md px-2 py-1',
              searchStore.isSelected(category[0], suggestion)
                ? 'bg-stone-900 text-stone-50'
                : 'bg-stone-100',
            ]"
            @pointerdown.stop.prevent="toggle(category[0], suggestion)"
          >
            {{ suggestion }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
