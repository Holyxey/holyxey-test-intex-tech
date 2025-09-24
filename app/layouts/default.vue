<template>
  <div class="mx-auto max-w-7xl p-4">
    <header class="sticky top-2 z-10 mb-4">
      <CarsSearch type="text" placeholder="Поиск по году / марке / вендору" />
    </header>
    <slot />
  </div>
</template>
