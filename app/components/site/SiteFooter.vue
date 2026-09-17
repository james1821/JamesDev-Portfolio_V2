<script setup lang="ts">
import type { Personal } from '#shared/types'

defineProps<{ personal: Personal }>()

const year = new Date().getFullYear()
</script>

<template>
  <footer class="mt-24 border-t border-line py-10">
    <div class="shell flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-content-strong">{{ personal.name }}</p>
        <p class="mt-1 font-mono text-2xs text-content-muted">
          &copy; {{ year }} · Built with Nuxt 4, Tailwind and Firebase
        </p>
      </div>

      <div class="flex items-center gap-2">
        <a
          :href="`mailto:${personal.email}`"
          class="btn-ghost btn-sm"
          aria-label="Email"
        ><AppIcon name="mail" /></a>
        <a
          v-if="personal.linkedin"
          :href="personal.linkedin"
          target="_blank"
          rel="noopener"
          class="btn-ghost btn-sm"
          aria-label="LinkedIn"
        ><AppIcon name="linkedin" /></a>
        <a
          v-if="personal.github"
          :href="personal.github"
          target="_blank"
          rel="noopener"
          class="btn-ghost btn-sm"
          aria-label="GitHub"
        ><AppIcon name="github" /></a>
      </div>
    </div>
  </footer>
</template>
