<script setup lang="ts">
import type { Certification } from '~/types'
const props = defineProps<{ certifications: Certification[] }>()
const { track, current, goTo, prev, next, onScroll } = useSlider(() => props.certifications.length)
</script>

<template>
  <section class="min-h-[calc(100vh-6rem)] flex flex-col justify-center py-16 relative overflow-hidden">

    <div class="absolute left-1/2 bottom-0 -translate-x-1/2 w-[600px] h-72 pointer-events-none"
      style="background: radial-gradient(ellipse, rgba(134,194,50,0.05) 0%, transparent 70%)" />

    
    <div class="section-container mb-10">
      <div class="flex items-end justify-between gap-4">
        <div>
          
          <h2 class="section-title">Certifications</h2>
          <div class="w-12 h-0.5 bg-accent mt-4" />
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <button @click="prev" :disabled="current === 0"
            class="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-text-secondary
                   transition-all duration-200 hover:border-accent hover:text-accent
                   disabled:opacity-25 disabled:cursor-not-allowed">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <span class="font-mono text-xs text-text-muted w-12 text-center tabular-nums">
            {{ String(current + 1).padStart(2,'0') }} / {{ String(certifications.length).padStart(2,'0') }}
          </span>
          <button @click="next" :disabled="current === certifications.length - 1"
            class="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-text-secondary
                   transition-all duration-200 hover:border-accent hover:text-accent
                   disabled:opacity-25 disabled:cursor-not-allowed">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    
    <div
      ref="track"
      @scroll="onScroll"
      class="flex gap-5 overflow-x-auto scrollbar-hide
             pb-2 select-none"
      style="padding-left: max(1.5rem, calc((100vw - 72rem) / 2));
             padding-right: max(1.5rem, calc((100vw - 72rem) / 2));
             scroll-padding-left: max(1.5rem, calc((100vw - 72rem) / 2));"
    >
      <div class="flex-shrink-0 w-0" aria-hidden="true" />

      <div
        v-for="(cert, i) in certifications"
        :key="i"
        class="group flex-shrink-0 w-[min(420px,88vw)]"
      >
        <div
          class="h-full border rounded-2xl p-7 bg-bg-card flex flex-col gap-5 relative overflow-hidden
                 transition-all duration-300"
          :class="current === i
            ? 'border-border-accent shadow-2xl shadow-accent-glow'
            : 'border-border hover:border-border-accent'"
        >
        
          <span
            class="absolute -bottom-5 -right-2 font-display font-black text-[7rem] leading-none
                   select-none pointer-events-none transition-colors duration-300"
            :class="current === i ? 'text-accent/5' : 'text-border/40'"
          >
            {{ String(i + 1).padStart(2,'0') }}
          </span>

        
          <div class="flex items-start justify-between gap-3">
            <div
              class="w-12 h-12 rounded-xl border flex-shrink-0 flex items-center justify-center overflow-hidden transition-all duration-300"
              :class="current === i ? 'border-border-accent bg-accent/8' : 'border-border bg-bg-elevated'"
            >
              <img
                v-if="cert.issuerLogo"
                :src="cert.issuerLogo"
                :alt="cert.issuer"
                class="w-7 h-7 object-contain"
                loading="lazy"
                @error="($event.target as HTMLImageElement).style.display = 'none'"
              />
              <svg v-if="!cert.issuerLogo" class="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <span class="font-mono text-xs text-text-muted pt-1">{{ cert.date }}</span>
          </div>

          
          <div class="flex-1 relative z-10">
            <h3 class="font-display font-semibold text-base text-text-primary mb-1
                       group-hover:text-accent transition-colors duration-200">
              {{ cert.title }}
            </h3>
            <p class="font-mono text-xs text-accent/80 mb-3">{{ cert.issuer }}</p>
            <p class="font-display text-sm text-text-secondary leading-relaxed">{{ cert.description }}</p>
          </div>

         
          <a
            v-if="cert.link"
            :href="cert.link"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-1.5 font-mono text-xs text-text-muted
                   hover:text-accent transition-colors duration-200 relative z-10 group/link mt-auto"
          >
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
            </svg>
            View credential
            <svg class="w-3 h-3 transition-transform duration-200
                        group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </a>
        </div>
      </div>

      <div class="flex-shrink-0 w-0" aria-hidden="true" />
    </div>

    
    <div class="flex justify-center gap-2 mt-7">
      <button
        v-for="(_, i) in certifications"
        :key="i"
        @click="goTo(i)"
        class="rounded-full transition-all duration-300"
        :class="current === i ? 'w-6 h-2 bg-accent' : 'w-2 h-2 bg-border hover:bg-text-muted'"
        :aria-label="`Go to cert ${i + 1}`"
      />
    </div>

  

  </section>
</template>
