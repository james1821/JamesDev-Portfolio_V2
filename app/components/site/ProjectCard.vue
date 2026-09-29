<script setup lang="ts">
import type { Project, Skill } from '#shared/types'
import { findTechIcon } from '../../utils/techIcon'

const props = defineProps<{ project: Project; skills?: Skill[]; eager?: boolean }>()
</script>

<template>
  <article class="surface-interactive group flex flex-col overflow-hidden">
    <div class="aspect-[16/9] overflow-hidden border-b border-line bg-raised">
      <NuxtImg
        v-if="project.image"
        :src="project.image"
        :alt="project.title"
        width="720"
        height="405"
        sizes="100vw sm:50vw lg:33vw"
        :loading="eager ? 'eager' : 'lazy'"
        class="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
      />
    </div>

    <div class="flex flex-1 flex-col gap-3 p-5">
      <h3 class="font-medium text-content-strong">{{ project.title }}</h3>
      <p class="flex-1 text-sm leading-relaxed text-content">{{ project.description }}</p>

      <ul class="flex flex-wrap gap-1.5" aria-label="Technologies used">
        <li v-for="tech in project.tech" :key="tech" class="chip">
          <img
            v-if="findTechIcon(tech, props.skills)"
            :src="findTechIcon(tech, props.skills)"
            :alt="`${tech} logo`"
            width="14"
            height="14"
            loading="lazy"
            class="mr-1 h-3.5 w-3.5 object-contain"
          />
          {{ tech }}
        </li>
      </ul>

      <div v-if="project.demo || project.github" class="flex gap-2 pt-1">
        <a v-if="project.demo" :href="project.demo" target="_blank" rel="noopener" class="btn-primary btn-sm flex-1">
          <AppIcon name="external" :size="15" />
          Live site
        </a>
        <a v-if="project.github" :href="project.github" target="_blank" rel="noopener" class="btn-secondary btn-sm flex-1">
          <AppIcon name="github" :size="15" />
          Source
        </a>
      </div>
    </div>
  </article>
</template>
