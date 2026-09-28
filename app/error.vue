<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const isMissing = computed(() => props.error.statusCode === 404)
</script>

<template>
  <div class="grid min-h-screen place-items-center bg-ink px-6">
    <div class="w-full max-w-md text-center">
      <p class="font-mono text-sm text-accent">{{ error.statusCode }}</p>
      <h1 class="mt-3 text-title font-semibold">
        {{ isMissing ? 'That page does not exist' : 'Something broke' }}
      </h1>
      <p class="mx-auto mt-3 max-w-prose text-content">
        {{ isMissing
          ? 'The link may be out of date. Everything else is still where you left it.'
          : 'Reload the page. If it keeps happening, the server is having a bad time.' }}
      </p>
      <button class="btn-primary mt-7" @click="clearError({ redirect: '/' })">
        Back to the portfolio
      </button>
    </div>
  </div>
</template>
