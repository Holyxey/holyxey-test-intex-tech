<script setup lang="ts">
  const carsStore = useCarsStore()
  const list = computed(() => carsStore.getAll())
</script>

<template>
  <section>
    <div class="p-4">
      <h1>Наши машины</h1>
      <p>Всего машин: {{ list.length }}</p>
    </div>

    <TransitionGroup appear tag="div" name="page" class="flex flex-wrap gap-x-10 gap-y-8">
      <CarsPreview v-for="(car, key) in list" :key :car />
    </TransitionGroup>
  </section>
</template>
