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

  //
  const searchSuggestions = ref<Record<string, string[]>>()
  const isSuggestionsOpened = ref(false)

  return { val, setKey, updateFromQuery, isInputFocused, searchSuggestions, isSuggestionsOpened }
})
