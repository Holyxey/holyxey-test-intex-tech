<script setup lang="ts">
  const searchStore = useSearchStore()
  function setSuggestion(suggestion: string) {
    searchStore.val = suggestion
    searchStore.isSuggestionsOpened = false
    searchStore.isInputFocused = false
  }
</script>

<template>
  <div
    v-if="Object.keys(searchStore.searchSuggestions || {}).length"
    :class="[
      'ease-cubic transition-all duration-300',
      'absolute rounded-b-2xl bg-stone-200 shadow-xl backdrop-blur-xs',
      'right-0 left-0 max-h-[calc(100svh-100px)] p-4',
      'overflow-y-auto',
      searchStore.isSuggestionsOpened ? 'top-full' : 'pointer-events-none top-0 opacity-0',
    ]"
  >
    <!-- 'top-15', -->
    <div v-if="searchStore.searchSuggestions" class="flex flex-wrap gap-4">
      <div
        v-for="(category, key) in Object.entries(searchStore.searchSuggestions)"
        :key
        :class="['flex min-w-40 flex-1 flex-col items-start gap-2', '']"
      >
        <p class="px-2 font-semibold">{{ category[0] }}</p>

        <p
          v-for="(suggestion, catKey) in category[1]"
          :key="suggestion || catKey"
          class="block w-full cursor-pointer rounded-md bg-stone-100 px-2 py-1"
          @pointerdown.stop.prevent="setSuggestion(suggestion)"
        >
          {{ suggestion }}
        </p>
      </div>
    </div>
  </div>
</template>
