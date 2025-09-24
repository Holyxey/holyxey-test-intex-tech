import { defineStore } from 'pinia'

export const useSearchStore = defineStore('SearchStore', () => {
  const value = ref<string>()
  function clear() {
    value.value = undefined
  }

  return { value, clear }
})
