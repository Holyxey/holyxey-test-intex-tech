<script setup lang="ts">
  defineProps<{
    trim: Record<string, string> // CarInfo['trim'][number] - тут не уверен как типизировать корректно
  }>()
</script>

<template>
  <CarsFullSection class="flex gap-x-4">
    <div
      v-for="value in Object.entries(trim)"
      v-show="value[1]"
      :key="value[0]"
      class="min-w-50 flex-1"
    >
      <CarsFullLine v-if="value[1]" :left="value[0]" :right="value[1]" />
    </div>
  </CarsFullSection>
</template>
