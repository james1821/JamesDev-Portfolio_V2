<script setup lang="ts">
import type { Personal } from '~/types'

const props = defineProps<{ personal: Personal }>()
const emit = defineEmits<{ (e: 'navigate', page: string): void }>()

const titles = [
  
  'Full-Stack Web Developer'
]

const displayedTitle = ref('')
const titleIndex = ref(0)
const isDeleting = ref(false)
let timeout: ReturnType<typeof setTimeout>

function tick() {
  const full = titles[titleIndex.value]

  if (!isDeleting.value) {
    displayedTitle.value = full.slice(0, displayedTitle.value.length + 1)

    if (displayedTitle.value === full) {
     
      if (titleIndex.value === titles.length - 1) return

      setTimeout(() => {
        isDeleting.value = true
        tick()
      }, 2000)
      return
    }

    timeout = setTimeout(tick, 65)

  } else {
    displayedTitle.value = full.slice(0, displayedTitle.value.length - 1)

    if (displayedTitle.value === '') {
      isDeleting.value = false

      if (titleIndex.value === titles.length - 1) return

      titleIndex.value += 1
      timeout = setTimeout(tick, 350)
      return
    }

    timeout = setTimeout(tick, 38)
  }
}

onMounted(() => { timeout = setTimeout(tick, 700) })
onUnmounted(() => clearTimeout(timeout))

const nameParts = computed(() => {
  const parts = props.personal.name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return {
      first: parts.slice(0, 2).join(' '),     
      rest: parts.slice(2).join(' ')          
    }
  }
  return {
    first: props.personal.name,
    rest: ''
  }
})

const quickLinks = [
  { id: 'experience',     label: 'Experience' },
  { id: 'stack',          label: 'Stack' },
  { id: 'projects',       label: 'Projects' },
  { id: 'certifications', label: 'Certs' },
]
</script>

<template>
  <section class="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden">

    
    <div class="absolute inset-0 bg-grid-pattern bg-grid opacity-50 pointer-events-none" />
    
    <div class="absolute inset-0 pointer-events-none"
      style="background: radial-gradient(ellipse 65% 55% at 65% 45%, rgba(134,194,50,0.06) 0%, transparent 65%)" />

    <div class="section-container w-full py-16">
      <div class="flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-[7rem]">

      
        <div class="flex-1 max-w-xl">

         

       
          <h1 class="font-display font-bold text-5xl md:text-6xl lg:text-[4.25rem] leading-[1.06] mb-5">
            <span class="text-text-primary">{{ nameParts.first }}</span>
            <br />
            <span class="text-gradient">{{ nameParts.rest }}</span>
          </h1>

         
          <div class="font-mono text-base md:text-lg text-text-secondary mb-5 min-h-[1.75rem]">
            <span>{{ displayedTitle }}</span>
            <span class="animate-blink text-accent ml-px">|</span>
          </div>

          
          <p class="font-display text-base text-text-secondary leading-relaxed mb-8">
            {{ personal.summary }}
          </p>

         
          <div class="flex flex-wrap gap-3 mb-10">
            <a :href="personal.email" class="btn-primary">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              Get In Touch
            </a>
            <a :href="personal.linkedin" target="_blank" rel="noopener" class="btn-outline">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
              LinkedIn
            </a>
            <a :href="personal.github" target="_blank" rel="noopener" class="btn-outline">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              GitHub
            </a>
            <a :href="personal.resume" target="_blank" rel="noopener"
              class="inline-flex items-center gap-1.5 font-mono text-xs text-text-muted hover:text-accent transition-colors">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Download CV
            </a>
          </div>

         
          <div class="flex flex-wrap items-center gap-2 pt-6 border-t border-border">
            <span class="font-mono text-xs text-text-muted">Explore →</span>
            <button
              v-for="link in quickLinks"
              :key="link.id"
              @click="emit('navigate', link.id)"
              class="font-mono text-xs px-3 py-1.5 rounded-lg border border-border text-text-secondary hover:border-border-accent hover:text-accent transition-all duration-200"
            >
              {{ link.label }}
            </button>
          </div>
        </div>

      
        <div class="flex-shrink-0">
          <div class="relative w-52 h-52 md:w-64 md:h-64 lg:w-72 lg:h-72">
           
            <div class="w-full h-full rounded-full overflow-hidden border-2 border-border bg-bg-card">
              <NuxtImg
                :src="personal.photo"
                :alt="personal.name"
                class="w-full h-full object-cover object-top"
                loading="eager"
              />
            </div>
           
          </div>
        </div>

      </div>
    </div>
  </section>
</template>