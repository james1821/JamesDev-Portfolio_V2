<script setup lang="ts">
import type { Personal } from '#shared/types'

const props = defineProps<{ personal: Personal }>()

const routes = [
  { to: '/', label: 'Home' },
  { to: '/experience', label: 'Experience' },
  { to: '/projects', label: 'Projects' },
  { to: '/stack', label: 'Stack' },
  { to: '/certifications', label: 'Certifications' },
]

const menuOpen = ref(false)
const lifted = ref(false)

// The site's mark. Deliberately fixed, not derived from personal.name — a
// logo shouldn't silently change if the display name is edited in settings.
const LOGO_MARK = 'MJE'

function onScroll() {
  lifted.value = window.scrollY > 8
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

watch(() => useRoute().fullPath, () => (menuOpen.value = false))
</script>

<template>
  <header
    class="sticky top-0 z-40 border-b transition-colors duration-300"
    :class="lifted ? 'border-line bg-ink/90 backdrop-blur-xl' : 'border-transparent bg-ink'"
  >
    <div class="shell flex h-16 items-center justify-between gap-4">
      <NuxtLink
        to="/"
        class="flex items-center gap-2.5 font-mono text-sm font-bold tracking-tight text-content-strong"
      >
        <span class="grid h-8 w-8 place-items-center rounded-lg bg-accent text-ink text-xs font-bold">{{ LOGO_MARK }}</span>
        <span class="hidden sm:inline">{{ personal.name }}</span>
      </NuxtLink>

      <nav aria-label="Primary" class="hidden items-center gap-1 md:flex">
        <NuxtLink
          v-for="route in routes"
          :key="route.to"
          :to="route.to"
          class="rounded-lg px-3 py-2 text-sm text-content transition hover:bg-raised hover:text-content-strong"
          active-class="bg-raised text-content-strong"
          exact-active-class="bg-raised text-content-strong"
        >
          {{ route.label }}
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-2">
        <a
          :href="personal.resume"
          target="_blank"
          rel="noopener"
          class="btn-primary btn-sm"
        >
          <AppIcon name="download" :size="15" />
          Resume
        </a>
        <button
          class="btn-ghost btn-sm md:hidden"
          :aria-expanded="menuOpen"
          aria-controls="mobile-nav"
          @click="menuOpen = !menuOpen"
        >
          <AppIcon :name="menuOpen ? 'close' : 'menu'" :size="18" />
          <span class="sr-only">{{ menuOpen ? 'Close menu' : 'Open menu' }}</span>
        </button>
      </div>
    </div>

    <nav v-show="menuOpen" id="mobile-nav" aria-label="Primary" class="border-t border-line md:hidden">
      <div class="shell grid gap-1 py-3">
        <NuxtLink
          v-for="route in routes"
          :key="route.to"
          :to="route.to"
          class="rounded-lg px-3 py-2.5 text-sm text-content"
          active-class="bg-raised text-content-strong"
          exact-active-class="bg-raised text-content-strong"
        >
          {{ route.label }}
        </NuxtLink>
      </div>
    </nav>
  </header>
</template>
