<script setup lang="ts">
import { usePortfolio } from '../composables/usePortfolio'

const { data: content } = await usePortfolio()

const grouped = computed(() => {
  const groups = new Map<string, typeof content.value.skills>()
  for (const skill of content.value?.skills ?? []) {
    const bucket = groups.get(skill.category) ?? []
    bucket.push(skill)
    groups.set(skill.category, bucket)
  }
  return [...groups.entries()]
})

useSeoMeta({
  title: 'Stack',
  description: 'The languages, frameworks, databases and tools used day to day.',
})
</script>

<template>
  <div v-if="content" class="shell py-14">
    <SectionHeading
      title="Stack"
      description="What I reach for, grouped by where it sits in a project."
    />

    <div class="space-y-10">
      <section v-for="[category, skills] in grouped" :key="category">
        <h2 class="mb-4 text-sm font-medium text-content-strong">{{ category }}</h2>
        <ul class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <li
            v-for="skill in skills"
            :key="skill.id"
            class="surface-interactive flex items-center gap-3 p-4"
          >
            <img
              v-if="skill.icon"
              :src="skill.icon"
              alt=""
              width="24"
              height="24"
              loading="lazy"
              class="h-6 w-6 object-contain"
            />
            <span class="text-sm text-content-strong">{{ skill.name }}</span>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
