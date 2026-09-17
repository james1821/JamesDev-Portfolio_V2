<script setup lang="ts">
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
    <SiteAssistantWidget v-if="content" :personal="content.personal" />
  </div>
</template>
