<script setup lang="ts">
  import type { InputHTMLAttributes } from 'vue'
  import { Icon } from '@iconify/vue'

  defineProps<{
    type: InputHTMLAttributes['type']
    placeholder: string
  }>()

  const searchStore = useSearchStore()

  const id = `search-${Math.random().toString(16).slice(2)}`
  const inputModel = defineModel<string>('input', {
    get: () => searchStore.val || '',
    set: (val) => {
      searchStore.val = val.toLowerCase()
      return searchStore.val
    },
  })
  const inputNode = useTemplateRef<HTMLInputElement>(id)
  watch(
    () => searchStore.isInputFocused,
    (val) => {
      if (val) {
        inputNode.value?.focus()
      } else {
        inputNode.value?.blur()
      }
    },
  )

  function inputOnFocus() {
    searchStore.isInputFocused = true
    searchStore.isSuggestionsOpened = true
  }
  function inputOnBlur() {
    searchStore.isInputFocused = false
    searchStore.isSuggestionsOpened = false
  }

  onMounted(() => {
    addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'f' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        searchStore.isInputFocused = true
        inputNode.value?.focus()
      }
    })
    addEventListener('keyup', (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        inputNode.value?.blur()
        searchStore.isInputFocused = false
      }
    })
  })
</script>

<template>
  <label
    :for="id"
    :class="[
      'transition-all',
      'flex items-center gap-4 bg-stone-200 p-2',
      searchStore.isInputFocused ? 'shadow-xl' : '',
      searchStore.isSuggestionsOpened && Object.keys(searchStore.searchSuggestions || {}).length
        ? 'rounded-t-2xl'
        : 'rounded-3xl',
    ]"
  >
    <!-- left button -->
    <div
      :class="[
        'ease-cubic transition-all duration-500',
        'relative h-8 cursor-pointer overflow-hidden rounded-full bg-stone-100/50 text-stone-500 shadow-md',
        inputModel ? 'w-8' : 'w-13',
      ]"
      @click="inputModel ? (inputModel = '') : null"
    >
      <Icon
        width="16"
        :class="[
          'ease-cubic transition-all duration-500',
          'absolute top-1/2 -translate-y-1/2',
          !inputModel ? 'left-2' : '-left-4',
        ]"
        icon="hugeicons:command"
      />
      <Icon
        width="16"
        :class="[
          'ease-cubic transition-all duration-500',
          'absolute top-1/2 -translate-y-1/2',
          !inputModel ? 'right-2' : '-right-4',
        ]"
        icon="tabler:circle-letter-f-filled"
      />

      <!-- Trash -->
      <Icon
        width="16"
        :class="[
          'ease-cubic transition-all duration-500',
          'absolute top-1/2 -translate-1/2',
          inputModel ? 'left-1/2' : '-left-1/2',
        ]"
        icon="solar:trash-bin-trash-line-duotone"
      />
    </div>

    <input
      :id
      :ref="id"
      v-model.trim="inputModel"
      :type
      :placeholder
      class="flex-1"
      @focus="inputOnFocus"
      @blur="inputOnBlur"
    />
  </label>
</template>
