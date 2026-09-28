<script setup lang="ts">
import type { CurrentWork } from '#shared/types'

defineProps<{ items: CurrentWork[] }>()
</script>

<template>
  <section v-if="items.length" class="shell py-14" aria-labelledby="current-work">
    <div class="mb-8 flex items-center gap-3">
      <span class="relative flex h-2.5 w-2.5" aria-hidden="true">
        <span class="absolute inline-flex h-full w-full animate-breathe rounded-full bg-accent" />
        <span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
      </span>
      <h2 id="current-work" class="section-heading">Currently working on</h2>
    </div>

    <div class="grid gap-5 sm:grid-cols-2">
      <article
        v-for="item in items"
        :key="item.id"
        class="surface-interactive group overflow-hidden"
      >
        <div class="aspect-[16/9] overflow-hidden border-b border-line bg-raised">
          <NuxtImg
            v-if="item.image"
            :src="item.image"
            :alt="item.title"
            width="640"
            height="360"
            sizes="100vw sm:50vw"
            loading="lazy"
            class="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
          />
        </div>
        <div class="p-5">
          <h3 class="font-medium text-content-strong">{{ item.title }}</h3>
          <p class="mt-2 text-sm leading-relaxed text-content clamp-3">{{ item.description }}</p>
        </div>
      </article>
    </div>
  </section>
</template>
