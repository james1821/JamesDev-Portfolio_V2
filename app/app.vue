<script setup lang="ts">
<<<<<<< HEAD
import { usePortfolio } from './composables/usePortfolio'

const { data: content } = await usePortfolio()

=======
const { data: content } = await usePortfolio()

>>>>>>> b87402ff7d3b4eb2de4ce096e6bfc16a4c5f65e7
const siteUrl = useRuntimeConfig().public.siteUrl as string | undefined

useSeoMeta({
  titleTemplate: (title) =>
    title ? `${title} · ${content.value?.personal.name}` : (content.value?.personal.name ?? 'Portfolio'),
  description: () => content.value?.personal.summary,
  ogTitle: () => `${content.value?.personal.name} — ${content.value?.personal.title}`,
  ogDescription: () => content.value?.personal.summary,
  ogImage: () => content.value?.personal.photo,
  ogType: 'profile',
  twitterCard: 'summary_large_image',
})

// Structured data helps recruiters' tooling and search engines read the page.
useHead(() => ({
  script: content.value
    ? [{
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: content.value.personal.name,
          jobTitle: content.value.personal.title,
          email: `mailto:${content.value.personal.email}`,
          url: siteUrl,
          sameAs: [content.value.personal.github, content.value.personal.linkedin].filter(Boolean),
          knowsAbout: content.value.skills.map((s) => s.name),
        }),
      }]
    : [],
}))
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
