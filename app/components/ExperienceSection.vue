<script setup lang="ts">
import type { Experience } from '~/types'
const props = defineProps<{ experience: Experience[] }>()
const { track, current, goTo, prev, next, onScroll } = useSlider(() => props.experience.length)
</script>

<template>
  <section class="min-h-[calc(100vh-6rem)] flex flex-col justify-center py-16 relative overflow-hidden">

    <div class="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
      style="background: radial-gradient(circle, rgba(134,194,50,0.04) 0%, transparent 70%)" />

   
    <div class="section-container mb-10">
      <div class="flex items-end justify-between gap-4">
        <div>
        
          <h2 class="section-title">Work Experience</h2>
          <div class="w-12 h-0.5 bg-accent mt-4" />
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
        v-for="(job, i) in experience"
        :key="i"
        class="flex-shrink-0 w-[min(480px,88vw)]"
      >
        <div
          class="h-full border rounded-2xl bg-bg-card flex flex-col gap-5 p-7
                 transition-all duration-300"
          :class="current === i
            ? 'border-border-accent shadow-2xl shadow-accent-glow'
            : 'border-border hover:border-border-accent'"
        >
         
          <div class="flex items-center justify-between">
            <span class="font-mono text-xs text-text-muted tabular-nums">
              {{ String(i + 1).padStart(2,'0') }} / {{ String(experience.length).padStart(2,'0') }}
            </span>
            <span class="font-mono text-xs text-accent bg-accent/10 px-2.5 py-1 rounded-full">
              {{ job.dates }}
            </span>
          </div>

          <div class="h-px w-full" :class="current === i ? 'bg-accent/25' : 'bg-border'" />

          
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-xl border border-border bg-bg-elevated
                        flex items-center justify-center flex-shrink-0 overflow-hidden">
              <template v-if="job.companyLogo">
                <img
                  :src="job.companyLogo"
                  :alt="job.company"
                  class="w-7 h-7 object-contain"
                  @error="($event.target as HTMLImageElement).parentElement!.innerHTML =
                    `<span class='font-mono text-xs font-bold text-accent'>${job.company.slice(0,2).toUpperCase()}</span>`"
                />
              </template>
              <span v-else class="font-mono text-xs font-bold text-accent">
                {{ job.company.slice(0, 2).toUpperCase() }}
              </span>
            </div>
            <div class="min-w-0">
              <p class="font-mono text-sm text-accent leading-none mb-0.5">{{ job.company }}</p>
              <h3 class="font-display font-semibold text-lg text-text-primary leading-tight">{{ job.role }}</h3>
            </div>
          </div>

       
          <p class="font-display text-sm text-text-secondary leading-relaxed flex-1">
            {{ job.description }}
          </p>

         
          <div class="flex flex-wrap gap-2 mt-auto">
            <span v-for="t in job.tech" :key="t" class="tech-tag">{{ t }}</span>
          </div>
        </div>
      </div>

      
      <div class="flex-shrink-0 w-0" aria-hidden="true" />
    </div>

   
    <div class="flex justify-center gap-2 mt-7">
      <button
        v-for="(_, i) in experience"
        :key="i"
        @click="goTo(i)"
        class="rounded-full transition-all duration-300"
        :class="current === i ? 'w-6 h-2 bg-accent' : 'w-2 h-2 bg-border hover:bg-text-muted'"
        :aria-label="`Go to slide ${i + 1}`"
      />
    </div>

    <p class="text-center font-mono text-xs text-text-muted mt-3 opacity-50 select-none">
      ← scroll, swipe or use arrows →
    </p>

  </section>
</template>
