<script setup lang="ts">
import type { Personal } from '#shared/types'

const props = defineProps<{ personal: Personal; yearsActive: number; projectCount: number }>()

const { open: openAssistant } = useAssistant()

const typed = ref('')
let timer: ReturnType<typeof setTimeout> | undefined

// Types the role out once on load. Skipped entirely for reduced-motion users,
// who get the finished string immediately.
function type() {
  const full = props.personal.title
  if (typed.value.length >= full.length) return
  typed.value = full.slice(0, typed.value.length + 1)
  timer = setTimeout(type, 55)
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    typed.value = props.personal.title
    return
  }
  timer = setTimeout(type, 400)
})

onUnmounted(() => clearTimeout(timer))
</script>

<template>
  <section class="relative overflow-hidden">
    <div class="pointer-events-none absolute inset-0 grid-backdrop" aria-hidden="true" />

    <div class="shell relative grid gap-12 py-16 lg:grid-cols-[1.35fr_1fr] lg:items-center lg:py-24">
      <div>
        <p
          v-if="personal.availability"
          class="animate-rise inline-flex items-center gap-2 rounded-full border border-accent/30
                 bg-accent-wash px-3 py-1 font-mono text-2xs text-accent-soft"
        >
          <span class="h-1.5 w-1.5 animate-breathe rounded-full bg-accent" />
          {{ personal.availability }}
        </p>

        <h1 class="animate-rise delay-step-1 mt-5 text-hero font-semibold">
          {{ personal.name }}
        </h1>

        <p class="animate-rise delay-step-2 mt-3 font-mono text-base text-accent-soft sm:text-lg">
          <span>{{ typed }}</span>
          <span class="animate-caret" aria-hidden="true">_</span>
        </p>

        <p class="animate-rise delay-step-3 lede mt-6">
          {{ personal.summary }}
        </p>

        <div class="animate-rise delay-step-4 mt-8 flex flex-wrap items-center gap-3">
          <a :href="`mailto:${personal.email}`" class="btn-primary">
            <AppIcon name="mail" :size="16" />
            Get in touch
          </a>
          <button type="button" class="btn-secondary" @click="openAssistant">
            <AppIcon name="sparkles" :size="16" />
            Ask about my work
          </button>
          <a
            v-if="personal.github"
            :href="personal.github"
            target="_blank"
            rel="noopener"
            class="btn-ghost"
          >
            <AppIcon name="github" :size="16" />
            GitHub
          </a>
        </div>

        <dl class="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-6">
          <div>
            <dt class="text-2xs text-content-muted">Years shipping</dt>
            <dd class="mt-0.5 font-mono text-xl text-content-strong">{{ yearsActive }}+</dd>
          </div>
          <div>
            <dt class="text-2xs text-content-muted">Projects delivered</dt>
            <dd class="mt-0.5 font-mono text-xl text-content-strong">{{ projectCount }}</dd>
          </div>
          <div v-if="personal.location">
            <dt class="text-2xs text-content-muted">Based in</dt>
            <dd class="mt-0.5 font-mono text-xl text-content-strong">{{ personal.location }}</dd>
          </div>
        </dl>
      </div>

      <div class="order-first flex justify-center lg:order-last lg:justify-end">
        <div class="relative">
          <div
            class="absolute -inset-3 rounded-full bg-accent/10 blur-2xl"
            aria-hidden="true"
          />
          <NuxtImg
            :src="personal.photo"
            :alt="`Portrait of ${personal.name}`"
            width="288"
            height="288"
            sizes="200px lg:288px"
            format="webp"
            preload
            loading="eager"
            fetchpriority="high"
            class="relative h-48 w-48 rounded-full border border-line object-cover object-top
                   sm:h-60 sm:w-60 lg:h-72 lg:w-72"
          />
        </div>
      </div>
    </div>
  </section>
</template>
