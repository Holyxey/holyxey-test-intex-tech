<script setup lang="ts">
  const props = defineProps<{
    left: string
    right: string | number
    is?: HTMLElementTagNameMap
  }>()

  const upperLeft = computed(() => {
    const woModel = props.left.replace('model_', '').replace('_', ' ')
    // return (props.left.charAt(0).toUpperCase() + props.left.slice(1)).replace('Model_', '')
    return woModel.charAt(0).toUpperCase() + woModel.slice(1)
  })

  const list = inject<Ref<Set<string>>>('chosen')!
  function toggleChoose() {
    if (list.value.has(props.left)) {
      list.value.delete(props.left)
    } else {
      list.value.add(props.left)
    }
  }

  const chosen = computed(() => list.value.has(props.left))
</script>

<template>
  <component
    :is="props.is || 'div'"
    :class="[
      'group/line relative select-none',
      'flex items-end gap-2 rounded-sm',
      'ease-cubic cursor-pointer transition-all',
      chosen ? `bg-blue-500 px-3 text-white shadow-xl` : 'hover:bg-blue-400/20 hover:px-1',
    ]"
    @click="toggleChoose"
  >
    <span :class="['opacity-70 group-hover/line:opacity-100', chosen && 'opacity-100']">
      {{ upperLeft }}
    </span>

    <div
      :class="[
        'ease-cubic transition-all',
        'h-[1px] flex-1 bg-stone-200',
        'group-hover/line:opacity-0',
        chosen && 'opacity-0',
      ]"
    />

    <span class="font-semibold">{{ right }}</span>
  </component>
</template>
