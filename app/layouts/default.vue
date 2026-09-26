<script setup lang="ts">
<<<<<<< HEAD
import { usePortfolio } from '../composables/usePortfolio'

=======
>>>>>>> b87402ff7d3b4eb2de4ce096e6bfc16a4c5f65e7
const { data: content } = await usePortfolio()
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50
             focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-ink"
    >
      Skip to content
    </a>

    <SiteHeader v-if="content" :personal="content.personal" />

    <main id="main" class="flex-1">
      <slot />
    </main>

    <SiteFooter v-if="content" :personal="content.personal" />
<<<<<<< HEAD
    <AssistantWidget v-if="content" :personal="content.personal" />
=======
    <SiteAssistantWidget v-if="content" :personal="content.personal" />
>>>>>>> b87402ff7d3b4eb2de4ce096e6bfc16a4c5f65e7
  </div>
</template>
