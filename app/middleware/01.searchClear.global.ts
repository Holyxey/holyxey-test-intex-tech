export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return
  const searchStore = useSearchStore()
  searchStore.clear()
})
