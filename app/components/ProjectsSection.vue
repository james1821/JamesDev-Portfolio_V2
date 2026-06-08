<script setup lang="ts">
import type { Project } from '~/types'
const props = defineProps<{ projects: Project[] }>()
const { track, current, goTo, prev, next, onScroll } = useSlider(() => props.projects.length)
</script>

<template>
  <section class="min-h-[calc(100vh-6rem)] flex flex-col justify-center py-16 relative overflow-hidden">

    <div class="absolute left-0 top-1/3 w-[500px] h-[500px] pointer-events-none"
      style="background: radial-gradient(circle, rgba(134,194,50,0.04) 0%, transparent 70%)" />

   
    <div class="section-container mb-10">
      <div class="flex items-end justify-between gap-4">
        <div>
          <span class="section-label">// 02. work</span>
          <h2 class="section-title">Featured Projects</h2>
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
            {{ String(current + 1).padStart(2,'0') }} / {{ String(projects.length).padStart(2,'0') }}
          </span>
          <button @click="next" :disabled="current === projects.length - 1"
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
      class="flex gap-5 overflow-x-auto scrollbar-hide pb-2 select-none"
      style="padding-left: max(1.5rem, calc((100vw - 72rem) / 2));
             padding-right: max(1.5rem, calc((100vw - 72rem) / 2));"
    >
      <div class="flex-shrink-0 w-0" aria-hidden="true" />

      <article
        v-for="(project, i) in projects"
        :key="i"
        class="group flex-shrink-0 w-[min(400px,88vw)]"
      >
        <div
          class="border rounded-2xl overflow-hidden bg-bg-card flex flex-col transition-all duration-300 h-full"
          :class="current === i
            ? 'border-border-accent shadow-2xl shadow-accent-glow'
            : 'border-border hover:border-border-accent'"
        >
          
          <div class="relative overflow-hidden flex-shrink-0" style="height: 160px;">
            <NuxtImg
              :src="project.image"
              :alt="project.title"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
              loading="lazy"
            />
            <div class="absolute top-2.5 left-2.5 font-mono text-xs bg-bg/80 backdrop-blur-sm text-accent px-2 py-0.5 rounded-md">
              {{ String(i + 1).padStart(2,'0') }}
            </div>
          </div>

          
          <div class="p-5 flex flex-col gap-3 flex-1">
            <h3 class="font-display font-semibold text-base text-text-primary group-hover:text-accent transition-colors duration-200">
              {{ project.title }}
            </h3>
            <p class="font-display text-sm text-text-secondary leading-relaxed flex-1">
              {{ project.description }}
            </p>
            <div class="flex flex-wrap gap-1.5 pt-1">
              <span v-for="t in project.tech" :key="t" class="tech-tag text-[11px] px-2 py-0.5">{{ t }}</span>
            </div>
            <div class="flex gap-2 pt-1">
              <a v-if="project.demo" :href="project.demo" target="_blank" rel="noopener"
                class="btn-primary text-xs flex-1 justify-center" @click.stop>
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
                Live Demo
              </a>
              <a v-if="project.github" :href="project.github" target="_blank" rel="noopener"
                class="btn-outline text-xs flex-1 justify-center" @click.stop>
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </div>
      </article>

      <div class="flex-shrink-0 w-0" aria-hidden="true" />
    </div>

    
    <div class="flex justify-center gap-2 mt-7">
      <button
        v-for="(_, i) in projects" :key="i" @click="goTo(i)"
        class="rounded-full transition-all duration-300"
        :class="current === i ? 'w-6 h-2 bg-accent' : 'w-2 h-2 bg-border hover:bg-text-muted'"
        :aria-label="`Go to project ${i + 1}`"
      />
    </div>

    <p class="text-center font-mono text-xs text-text-muted mt-3 opacity-50 select-none">
      ← drag, swipe or use arrows →
    </p>

  </section>
</template>
