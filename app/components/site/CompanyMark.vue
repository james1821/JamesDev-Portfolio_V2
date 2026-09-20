<script setup lang="ts">
const props = defineProps<{ name: string; logo?: string; size?: number }>()

const failed = ref(false)
const fallback = computed(() => props.name.slice(0, 2).toUpperCase())
const box = computed(() => `${props.size ?? 44}px`)
</script>

<template>
  <div
    class="grid shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-raised"
    :style="{ width: box, height: box }"
  >
    <img
      v-if="logo && !failed"
      :src="logo"
      :alt="`${name} logo`"
      loading="lazy"
      class="h-[62%] w-[62%] object-contain"
      @error="failed = true"
    />
    <span v-else class="font-mono text-xs font-bold text-accent">{{ fallback }}</span>
  </div>
</template>
