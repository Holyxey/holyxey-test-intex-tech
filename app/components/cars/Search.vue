<script setup lang="ts">
  import type { InputHTMLAttributes } from 'vue'
  import { Icon } from '@iconify/vue'

  defineProps<{
    type: InputHTMLAttributes['type']
    placeholder: string
  }>()

  const searchValue = useSearchStore()

  const id = `search-${Math.random().toString(16).slice(2)}`
  const inputModel = defineModel<string>('input', {
    set: (val) => {
      searchValue.value = val.toLowerCase()
      return searchValue.value
    },
  })

  const isFocused = ref(false)

  onMounted(() => {
    addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'f' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        const el = document.getElementById(id)
        if (el) el.focus()
      }
    })
    addEventListener('keyup', (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const el = document.getElementById(id)
        if (el) el.blur()
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
      isFocused ? 'shadow-xl' : '',
    ]"
  >
    <!-- left icon -->
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
      v-model.trim="inputModel"
      :type
      :placeholder
      class="flex-1"
      @focus="isFocused = true"
      @blur="isFocused = false"
    />
  </label>
</template>
