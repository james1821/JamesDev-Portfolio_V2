<script setup lang="ts">
defineProps<{ title: string; description?: string; to?: string; linkLabel?: string }>()
</script>

<template>
  <div class="mb-8 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h2 class="section-heading">{{ title }}</h2>
      <p v-if="description" class="lede mt-2">{{ description }}</p>
    </div>
    <NuxtLink v-if="to" :to="to" class="btn-ghost btn-sm">
      {{ linkLabel ?? 'View all' }}
      <AppIcon name="arrow" :size="15" />
    </NuxtLink>
  </div>
</template>
