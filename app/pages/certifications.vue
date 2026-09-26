<script setup lang="ts">
<<<<<<< HEAD
import { usePortfolio } from '../composables/usePortfolio'

=======
>>>>>>> b87402ff7d3b4eb2de4ce096e6bfc16a4c5f65e7
const { data: content } = await usePortfolio()

useSeoMeta({
  title: 'Certifications',
  description: 'Completed certifications with links to the issued credentials.',
})
</script>

<template>
  <div v-if="content" class="shell py-14">
    <SectionHeading
      title="Certifications"
      description="Each one links to the credential issued by the provider."
    />

    <div class="grid gap-5 md:grid-cols-2">
      <article v-for="cert in content.certifications" :key="cert.id" class="surface-interactive flex flex-col p-6">
        <div class="flex items-start gap-3">
          <CompanyMark :name="cert.issuer" :logo="cert.issuerLogo" :size="40" />
          <div class="min-w-0 flex-1">
            <h2 class="font-medium text-content-strong">{{ cert.title }}</h2>
            <p class="mt-0.5 text-sm text-content">{{ cert.issuer }} · {{ cert.date }}</p>
          </div>
        </div>

        <p class="mt-4 flex-1 text-sm leading-relaxed text-content">{{ cert.description }}</p>

        <a
          v-if="cert.link"
          :href="cert.link"
          target="_blank"
          rel="noopener"
          class="btn-secondary btn-sm mt-5 self-start"
        >
          <AppIcon name="external" :size="15" />
          View credential
        </a>
      </article>
    </div>
  </div>
</template>
