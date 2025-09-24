<script setup lang="ts">
  const searchStore = useSearchStore()
  onMounted(() => {
    searchStore.setKey('list')
    searchStore.updateFromQuery()
  })
</script>

<template>
  <CarsList />
</template>
