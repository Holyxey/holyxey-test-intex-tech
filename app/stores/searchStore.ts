import { defineStore } from 'pinia'

export const useSearchStore = defineStore('SearchStore', () => {
  const store = ref(new Map<string, string>())

  const value = ref<string>()
  const key = ref<string>()

  function setKey(k: string) {
    key.value = k.trim().toLowerCase()
  }

  function updateFromQuery() {
    const k = key.value?.trim().toLowerCase()
    if (k) {
      const q = useRoute().query[k]
      if (q && typeof q === 'string') {
        value.value = q
        store.value.set(k, q)
      } else {
        value.value = ''
        store.value.delete(k)
      }
    }
  }

  watch(value, (val) => {
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

  return { value, setKey, updateFromQuery }
})
