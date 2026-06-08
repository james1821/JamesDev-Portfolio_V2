<script setup lang="ts">
import type { PortfolioData } from '~/types'
import portfolioJson from '~/data/data.json'

const portfolio = portfolioJson as PortfolioData

type Page = 'home' | 'experience' | 'stack' | 'projects' | 'certifications'
const activePage = ref<Page>('home')
const isTransitioning = ref(false)

function navigate(page: string) {
  if (page === activePage.value) return
  isTransitioning.value = true
  setTimeout(() => {
    activePage.value = page as Page
    isTransitioning.value = false
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, 180)
}

useSeoMeta({
  title: `${portfolio.personal.name} — ${portfolio.personal.title}`,
  description: portfolio.personal.summary,
  ogTitle: `${portfolio.personal.name} — ${portfolio.personal.title}`,
  ogDescription: portfolio.personal.summary,
})
</script>

<template>
  <div class="bg-bg text-text-primary min-h-screen flex flex-col">

    <TheNavbar
      :personal="portfolio.personal"
      :active-page="activePage"
      @navigate="navigate"
    />

    <main class="flex-1 pt-16">
      <Transition name="page-fade" mode="out-in">
        <div :key="activePage">

          <HeroSection
            v-if="activePage === 'home'"
            :personal="portfolio.personal"
            @navigate="navigate"
          />

          <ExperienceSection
            v-else-if="activePage === 'experience'"
            :experience="portfolio.experience"
          />

          <TechStackSection
            v-else-if="activePage === 'stack'"
            :techstack="portfolio.techstack"
          />

          <ProjectsSection
            v-else-if="activePage === 'projects'"
            :projects="portfolio.projects"
          />

          <CertificationsSection
            v-else-if="activePage === 'certifications'"
            :certifications="portfolio.certifications"
          />

        </div>
      </Transition>
    </main>

    <TheFooter :personal="portfolio.personal" @navigate="navigate" />

  </div>
</template>

<style>
.page-fade-enter-active { transition: opacity 0.22s ease, transform 0.22s ease; }
.page-fade-leave-active { transition: opacity 0.16s ease, transform 0.16s ease; }
.page-fade-enter-from   { opacity: 0; transform: translateY(10px); }
.page-fade-leave-to     { opacity: 0; transform: translateY(-6px); }
</style>
