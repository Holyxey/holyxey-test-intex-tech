import { defineStore } from 'pinia'

export const useSearchStore = defineStore('SearchStore', () => {
  const store = ref(new Map<string, string>())

  const val = ref<string>()
  const key = ref<string>()
  const isInputFocused = ref(false)

  function setKey(k: string) {
    key.value = k.trim().toLowerCase()
  }
  function updateFromQuery() {
    const k = key.value?.trim().toLowerCase()
    if (k) {
      const q = useRoute().query[k]
      if (q && typeof q === 'string') {
        val.value = q
        store.value.set(k, q)
      } else {
        val.value = ''
        store.value.delete(k)
      }
    }
  }
  watch(val, (val) => {
    const k = key.value?.trim().toLowerCase()
    if (k) {
      if (typeof val === 'string') {
        store.value.set(k, val)
        useRouter().replace({ query: { ...useRoute().query, [k]: val } })
      } else {
        store.value.delete(k)
      }
    }
  })

  // Общий список
  const searchSuggestions = ref<Record<string, string[]>>({})
  const isSuggestionsOpened = ref(false)

  // выбранные фильтры
  const selectedFilters = ref<Record<string, Set<string>>>({})

  function toggleFilter(category: string, value: string) {
    const cat = category.trim()
    const val = value.trim()

    if (!selectedFilters.value[cat]) selectedFilters.value[cat] = new Set<string>()
    if (selectedFilters.value[cat].has(val)) selectedFilters.value[cat].delete(val)
    else selectedFilters.value[cat].add(val)

    selectedFilters.value = { ...selectedFilters.value }
  }

  function clearCategory(category: string) {
    const cat = category.trim()

    if (!selectedFilters.value[cat]) return

    const { [cat]: _дроп, ...rest } = selectedFilters.value
    selectedFilters.value = { ...rest }
  }

  function clearAllFilters() {
    selectedFilters.value = {}
  }

  function isSelected(category: string, value: string) {
    const cat = category.trim()
    const val = value.trim()
    return !!selectedFilters.value[cat]?.has(val)
  }

  //
  function clearEverything() {
    val.value = ''
    useRouter().replace({ query: {} })
    isInputFocused.value = false
    isSuggestionsOpened.value = false
    selectedFilters.value = {}
  }

  return {
    val,
    setKey,
    updateFromQuery,
    isInputFocused,
    searchSuggestions,
    isSuggestionsOpened,

    // фильтры
    selectedFilters,
    toggleFilter,
    clearCategory,
    clearAllFilters,
    isSelected,

    // общие
    clearEverything,
  }
})
