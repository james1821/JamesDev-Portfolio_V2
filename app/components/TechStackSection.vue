<script setup lang="ts">
import type { TechItem } from '~/types'
const props = defineProps<{ techstack: TechItem[] }>()

const CATEGORY_ORDER = ['Frontend', 'Backend', 'Database', 'Languages', 'Tools']

const CATEGORY_META: Record<string, { color: string; iconPath: string }> = {
  Frontend:  {
    color: '#86c232',
    iconPath: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
  Backend: {
    color: '#5ba0d0',
    iconPath: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01',
  },
  Database: {
    color: '#e07b5c',
    iconPath: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4',
  },
  Languages: {
    color: '#c78af5',
    iconPath: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
  },
  Tools: {
    color: '#f5a623',
    iconPath: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z',
  },
}

const grouped = computed(() => {
  const map: Record<string, TechItem[]> = {}
  props.techstack.forEach(t => {
    if (!map[t.category]) map[t.category] = []
    map[t.category].push(t)
  })
  return CATEGORY_ORDER
    .map(cat => ({
      cat,
      meta: CATEGORY_META[cat] ?? { color: '#86c232', iconPath: '' },
      items: map[cat] ?? [],
    }))
    .filter(g => g.items.length > 0)
})


function onImgError(e: Event, item: TechItem) {
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
  const fallback = img.nextElementSibling as HTMLElement | null
  if (fallback) fallback.style.display = 'flex'
}
</script>

<template>
  <section class="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-16 relative overflow-hidden">

    <div class="absolute inset-0 pointer-events-none"
      style="background: radial-gradient(ellipse 60% 50% at 50% 50%, rgba(134,194,50,0.03) 0%, transparent 70%)" />

    <div class="section-container mb-12">
      <span class="section-label">// 03. toolkit</span>
      <h2 class="section-title">Tech Stack</h2>
      <div class="w-12 h-0.5 bg-accent mt-4" />
    </div>

    <div class="section-container">
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 lg:gap-6">

        <div v-for="group in grouped" :key="group.cat" class="flex flex-col gap-3">

        
          <div class="flex items-center gap-2.5 pb-3"
            :style="{ borderBottom: '1px solid ' + group.meta.color + '28' }">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              :style="{ background: group.meta.color + '12', border: '1px solid ' + group.meta.color + '30' }">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"
                :style="{ color: group.meta.color }">
                <path stroke-linecap="round" stroke-linejoin="round" :d="group.meta.iconPath" />
              </svg>
            </div>
            <span class="font-mono text-xs font-bold tracking-wider" :style="{ color: group.meta.color }">
              {{ group.cat }}
            </span>
          </div>

         
          <div
            v-for="item in group.items"
            :key="item.name"
            class="group flex items-center gap-3 px-3 py-2.5 rounded-xl border border-border bg-bg-card
                   hover:border-border-accent hover:bg-bg-elevated
                   transition-all duration-200 cursor-default"
          >
          
            <div class="w-7 h-7 flex-shrink-0 relative flex items-center justify-center">
              <img
                v-if="item.icon"
                :src="item.icon"
                :alt="item.name"
                class="w-6 h-6 object-contain"
                loading="lazy"
                @error="onImgError($event, item)"
              />
             
              <span
                class="font-mono text-[10px] font-bold items-center justify-center"
                :style="{ color: group.meta.color, display: item.icon ? 'none' : 'flex' }"
              >
                {{ item.name.slice(0, 2).toUpperCase() }}
              </span>
            </div>

            <span class="font-display text-sm text-text-primary group-hover:text-accent transition-colors duration-200 leading-tight">
              {{ item.name }}
            </span>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>
