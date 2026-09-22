<script setup lang="ts">
import { usePortfolio } from '../composables/usePortfolio'

const { data: content } = await usePortfolio()

const filter = ref('All')

const technologies = computed(() => {
  const all = (content.value?.projects ?? []).flatMap((p) => p.tech)
  return ['All', ...[...new Set(all)].sort()]
})

const visible = computed(() => {
  const projects = content.value?.projects ?? []
  return filter.value === 'All' ? projects : projects.filter((p) => p.tech.includes(filter.value))
})

useSeoMeta({
  title: 'Projects',
  description: 'Production applications and side projects, with source and live links where available.',
})
</script>

<template>
  <div v-if="content" class="shell py-14">
    <SectionHeading
      title="Projects"
      description="Client work and personal builds. Filter by the technology you care about."
    />

    <div class="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter projects by technology">
      <button
        v-for="tech in technologies"
        :key="tech"
        type="button"
        class="chip transition"
        :class="filter === tech
          ? 'border-accent/60 bg-accent-wash text-accent-soft'
          : 'hover:border-line-strong hover:text-content-strong'"
        :aria-pressed="filter === tech"
        @click="filter = tech"
      >
        {{ tech }}
      </button>
    </div>

    <div v-if="visible.length" class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      <ProjectCard
        v-for="(project, index) in visible"
        :key="project.id"
        :project="project"
        :eager="index < 3"
      />
    </div>

    <p v-else class="surface p-8 text-center text-content">
      Nothing built with {{ filter }} yet.
      <button type="button" class="text-accent-soft underline" @click="filter = 'All'">Show everything</button>
    </p>
  </div>
</template>
