<script setup lang="ts">
import type { Personal } from '~/types'

defineProps<{
  personal: Personal
  activePage: string
}>()

const emit = defineEmits<{ (e: 'navigate', page: string): void }>()

const pages = [
  { id: 'home',           label: 'Home' },
  { id: 'experience',     label: 'Experience' },
  { id: 'stack',          label: 'Stack' },
  { id: 'projects',       label: 'Projects' },
  { id: 'certifications', label: 'Certs' },
]

const scrolled = ref(false)
onMounted(() => {
  window.addEventListener('scroll', () => { scrolled.value = window.scrollY > 10 }, { passive: true })
})
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="scrolled
      ? 'bg-bg/95 backdrop-blur-md border-b border-border shadow-lg shadow-black/30'
      : 'bg-bg/80 backdrop-blur-sm border-b border-border/40'"
  >
    
    <div class="section-container flex items-center justify-between h-12 gap-4">
      <button
        class="font-mono text-sm font-bold tracking-wider text-accent hover:opacity-75 transition-opacity flex-shrink-0"
        @click="emit('navigate', 'home')"
      >
        {{ personal.name.split(' ').map((w: string) => w[0]).join('') }}<span class="text-text-secondary">_dev</span>
      </button>

      <a
        :href="personal.resume"
        target="_blank"
        rel="noopener"
        class="btn-primary text-xs font-mono tracking-wider flex-shrink-0"
      >
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        Resume
      </a>
    </div>

    <div class="border-t border-border/50">
      <div class="flex overflow-x-auto scrollbar-hide md:justify-center px-4 md:px-6 lg:px-8 gap-1 py-1.5">
        <button
          v-for="page in pages"
          :key="page.id"
          @click="emit('navigate', page.id)"
          class="flex-shrink-0 px-4 py-1.5 rounded-lg font-display text-xs md:text-xl font-medium
                 transition-all duration-200 whitespace-nowrap"
          :class="activePage === page.id
            ? 'text-bg bg-accent shadow-sm'
            : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'"
        >
          {{ page.label }}
        </button>
      </div>
    </div>
  </header>
</template>
