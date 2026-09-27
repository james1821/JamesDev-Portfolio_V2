<script setup lang="ts">
import { usePortfolio } from '../composables/usePortfolio'

const { data: content } = await usePortfolio()

useSeoMeta({
  title: 'Experience',
  description: 'Roles, responsibilities and the technologies used in each.',
})
</script>

<template>
  <div v-if="content" class="shell py-14">
    <SectionHeading
      title="Work experience"
      description="Roles in reverse-chronological order, with what I actually shipped in each."
    />

    <ol class="relative border-l border-line pl-6 sm:pl-8">
      <li v-for="job in content.experience" :key="job.id" class="relative pb-10 last:pb-0">
        <span
          class="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-ink bg-accent sm:-left-[39px]"
          aria-hidden="true"
        />

        <div class="surface p-6">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div class="flex items-center gap-3">
              <CompanyMark :name="job.company" :logo="job.companyLogo" />
              <div>
                <h2 class="font-medium text-content-strong">{{ job.role }}</h2>
                <p class="text-sm text-content">{{ job.company }}</p>
              </div>
            </div>
            <p class="chip">{{ job.startDate }} – {{ job.endDate }}</p>
          </div>

          <p class="lede mt-5">{{ job.description }}</p>

          <ul class="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies used">
            <li v-for="tech in job.tech" :key="tech" class="chip">{{ tech }}</li>
          </ul>
        </div>
      </li>
    </ol>
  </div>
</template>
