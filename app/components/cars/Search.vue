<script setup lang="ts">
  import type { InputHTMLAttributes } from 'vue'
  import { Icon } from '@iconify/vue'
  import { Icons } from '@/constants/icons'

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

  //
  const isAnyFilters = computed(() => {
    const chosenFilters = Object.values(searchStore.selectedFilters).filter((v) => v.size)
    return !!inputModel.value || !!chosenFilters.length
  })
  function clearAll() {
    searchStore.clearEverything()
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
      'flex items-center gap-4 rounded-full bg-stone-200 p-2',
      searchStore.isInputFocused ? 'shadow-xl' : '',
    ]"
  >
    <!-- left button -->
    <div
      :class="[
        'ease-cubic transition-all duration-500',
        'relative h-8 cursor-pointer overflow-hidden rounded-full shadow-md',
        isAnyFilters ? 'w-8 bg-stone-800 text-stone-50' : 'w-13 bg-stone-100/50 text-stone-500',
      ]"
      @click.stop.prevent="clearAll"
    >
      <Icon
        width="16"
        :class="[
          'ease-cubic transition-all duration-500',
          'absolute top-1/2 -translate-y-1/2',
          !isAnyFilters ? 'left-2' : '-left-4',
        ]"
        :icon="Icons.Command"
      />
      <Icon
        width="16"
        :class="[
          'ease-cubic transition-all duration-500',
          'absolute top-1/2 -translate-y-1/2',
          !isAnyFilters ? 'right-2' : '-right-4',
        ]"
        :icon="Icons.LetterF"
      />

      <!-- Trash -->
      <Icon
        width="16"
        :class="[
          'ease-cubic transition-all duration-500',
          'absolute top-1/2 -translate-1/2',
          isAnyFilters ? 'left-1/2' : '-left-1/2',
        ]"
        :icon="Icons.Trash"
      />
    </div>

    <input
      :id
      :ref="id"
      v-model.trim="inputModel"
      :type
      :placeholder
      class="block h-full w-full flex-1 rounded-full px-4"
      @focus="inputOnFocus"
      @blur="inputOnBlur"
    />
  </label>
</template>
