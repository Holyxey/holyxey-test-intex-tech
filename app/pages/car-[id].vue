<script setup lang="ts">
  const searchStore = useSearchStore()
  onMounted(() => {
    searchStore.setKey('card')
    searchStore.updateFromQuery()
  })
</script>

<template>
  <CarsFullCard />
</template>
