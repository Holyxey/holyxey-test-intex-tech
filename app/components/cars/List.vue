<script setup lang="ts">
  import type { CarInfo } from '~~/types'

  const carsStore = useCarsStore()
  const searchStore = useSearchStore()
  const list = computed(() => carsStore.getAll())

  const isFoundedList = computed<CarInfo[]>(() => {
    const text = searchStore.val?.trim()
    const hasText = !!text

    const activeFilters = searchStore.selectedFilters
    const categories = Object.entries(activeFilters).filter(([_, set]) => set && set.size > 0)

    // Если пусто - возвращаю весь список
    if (!hasText && categories.length === 0) return list.value

    return list.value.filter((car) => {
      const textOk = !hasText
        ? true
        : (() => {
            // чищу от нефильтрованного
            const { photo: _др, trims: _оп, ...searchableCar } = car
            const rx = new RegExp(text, 'ig')
            return Object.values(searchableCar).some((v) => rx.test(v?.toString?.() || ''))
          })()

      if (!textOk) return false

      // Filters: AND across categories, OR within a category
      for (const [category, set] of categories) {
        const values = [...set]
        let matched = false

        switch (category) {
          case 'По годам':
            matched = values.includes(car.year.toString())
            break
          case 'По марке':
            matched = values.includes(car.make)
            break
          case 'По модели':
            matched = values.includes(car.model)
            break
          default:
            matched = true
        }
        if (!matched) return false
      }

      return true
    })
  })

  function makeSuggestions() {
    searchStore.searchSuggestions = {
      'По годам': [...new Set(list.value.map((c) => c.year.toString().trim()))],
      'По марке': [...new Set(list.value.map((c) => c.make))],
      'По модели': [...new Set(list.value.map((c) => c.model))],
    }
  }

  onMounted(() => {
    makeSuggestions()

    watch(
      () => list.value,
      () => makeSuggestions(),
      { deep: true },
    )
  })
  onUnmounted(() => {
    searchStore.searchSuggestions = {}
  })
</script>

<template>
  <section>
    <TransitionGroup
      appear
      tag="div"
      name="page"
      class="grid gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
    >
      <CarsPreview v-for="(car, key) in isFoundedList" :key :car />
    </TransitionGroup>
  </section>
</template>
