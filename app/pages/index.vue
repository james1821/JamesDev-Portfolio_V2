<script setup lang="ts">
<<<<<<< HEAD
import { usePortfolio, useActiveWork, useFeaturedProjects } from '../composables/usePortfolio'

=======
>>>>>>> b87402ff7d3b4eb2de4ce096e6bfc16a4c5f65e7
const { data: content } = await usePortfolio()

const activeWork = useActiveWork(content)
const featured = useFeaturedProjects(content)

const yearsActive = computed(() => {
  const earliest = content.value?.experience
    .map((job) => Number.parseInt(job.startDate.match(/\d{4}/)?.[0] ?? '', 10))
    .filter(Number.isFinite)
    .sort((a, b) => a - b)[0]
  return earliest ? Math.max(1, new Date().getFullYear() - earliest) : 2
})

const topSkills = computed(() => (content.value?.skills ?? []).slice(0, 10))
const latestRole = computed(() => content.value?.experience[0])

useSeoMeta({ title: '' })
</script>

<template>
  <div v-if="content">
    <HeroPanel
      :personal="content.personal"
      :years-active="yearsActive"
      :project-count="content.projects.length"
    />

    <CurrentWorkPanel :items="activeWork" />

    <section v-if="featured.length" class="shell py-14">
      <SectionHeading
        title="Selected work"
        description="A few things worth opening. The full list lives on the projects page."
        to="/projects"
        link-label="All projects"
      />
      <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <ProjectCard v-for="project in featured" :key="project.id" :project="project" />
      </div>
    </section>

    <section v-if="latestRole" class="shell py-14">
      <SectionHeading title="Where I work" to="/experience" link-label="Full history" />
      <div class="surface p-6 sm:p-7">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <CompanyMark :name="latestRole.company" :logo="latestRole.companyLogo" />
            <div>
              <p class="font-medium text-content-strong">{{ latestRole.role }}</p>
              <p class="text-sm text-content">{{ latestRole.company }}</p>
            </div>
          </div>
          <p class="font-mono text-2xs text-content-muted">
            {{ latestRole.startDate }} – {{ latestRole.endDate }}
          </p>
        </div>
        <p class="lede mt-5">{{ latestRole.description }}</p>
      </div>
    </section>

    <section v-if="topSkills.length" class="shell py-14">
      <SectionHeading title="Working stack" to="/stack" link-label="Everything I use" />
      <ul class="flex flex-wrap gap-2">
        <li
          v-for="skill in topSkills"
          :key="skill.id"
          class="flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-sm text-content"
        >
          <img v-if="skill.icon" :src="skill.icon" alt="" width="18" height="18" loading="lazy" class="h-[18px] w-[18px]" />
          {{ skill.name }}
        </li>
      </ul>
    </section>

    <section class="shell py-14">
      <div class="surface flex flex-col items-start gap-5 p-7 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-xl font-semibold text-content-strong">Hiring for a full-stack role?</h2>
          <p class="lede mt-2">Send the brief and I'll tell you honestly whether I'm the right fit.</p>
        </div>
        <a :href="`mailto:${content.personal.email}`" class="btn-primary shrink-0">
          <AppIcon name="mail" :size="16" />
          {{ content.personal.email }}
        </a>
      </div>
    </section>
  </div>
</template>
