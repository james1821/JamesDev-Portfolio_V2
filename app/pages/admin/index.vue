<script setup lang="ts">
import type { PortfolioContent } from '#shared/types'
<<<<<<< HEAD
import { useAuth } from '../../composables/useAuth'
import { useFirebase } from '../../lib/firebase'
=======
>>>>>>> b87402ff7d3b4eb2de4ce096e6bfc16a4c5f65e7

definePageMeta({ layout: 'admin' })

const { user } = useAuth()

const counts = ref<Record<string, number>>({})
const seeding = ref(false)
const seedMessage = ref('')
const loading = ref(true)

const COLLECTIONS = ['currentWork', 'projects', 'experience', 'skills', 'certifications'] as const

const LABELS: Record<string, string> = {
  currentWork: 'Currently working on',
  projects: 'Projects',
  experience: 'Roles',
  skills: 'Skills',
  certifications: 'Certifications',
}

async function loadCounts() {
  const { db } = useFirebase()
  const { collection, getCountFromServer } = await import('firebase/firestore')
  const results = await Promise.all(
    COLLECTIONS.map(async (name) => [name, (await getCountFromServer(collection(db, name))).data().count] as const),
  )
  counts.value = Object.fromEntries(results)
  loading.value = false
}

/** One-time helper that copies the bundled starter records into Firestore. */
async function seed() {
  seeding.value = true
  seedMessage.value = ''
  try {
    const content = await $fetch<PortfolioContent>('/api/seed-data')
    const { db } = useFirebase()
    const { doc, writeBatch, collection } = await import('firebase/firestore')
    const batch = writeBatch(db)

    batch.set(doc(db, 'config', 'site'), content.personal, { merge: true })
    for (const name of COLLECTIONS) {
      for (const record of content[name]) {
        const { id, ...rest } = record
        batch.set(doc(collection(db, name), id), rest, { merge: true })
      }
    }

    await batch.commit()
    await loadCounts()
    seedMessage.value = 'Starter content written. Edit or delete any of it from the sections on the left.'
  } catch (error) {
    seedMessage.value = error instanceof Error ? error.message : 'Could not write the starter content.'
  } finally {
    seeding.value = false
  }
}

const isEmpty = computed(() => Object.values(counts.value).every((n) => n === 0))

onMounted(loadCounts)
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-xl font-semibold text-content-strong">
        Welcome back{{ user?.displayName ? `, ${user.displayName.split(' ')[0]}` : '' }}
      </h1>
      <p class="lede mt-1 text-sm">
        You own this dashboard. Changes appear on the public site within five minutes, or immediately after a redeploy.
      </p>
    </div>

    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="name in COLLECTIONS"
        :key="name"
        :to="`/admin/${name === 'currentWork' ? 'current' : name}`"
        class="surface-interactive p-5"
      >
        <p class="text-2xs text-content-muted">{{ LABELS[name] }}</p>
        <p class="mt-1 font-mono text-2xl text-content-strong">
          <span v-if="loading" class="skeleton inline-block h-7 w-8 align-middle" />
          <span v-else>{{ counts[name] ?? 0 }}</span>
        </p>
      </NuxtLink>
    </div>

    <section v-if="isEmpty && !loading" class="surface p-6">
      <h2 class="text-sm font-medium text-content-strong">Your database is empty</h2>
      <p class="lede mt-2 text-sm">
        The public site is currently rendering the bundled starter content. Write it into Firestore so you can edit it here.
      </p>
      <button type="button" class="btn-primary btn-sm mt-4" :disabled="seeding" @click="seed">
        <AppIcon name="plus" :size="15" />
        {{ seeding ? 'Writing…' : 'Import starter content' }}
      </button>
      <p v-if="seedMessage" class="mt-3 text-sm text-content">{{ seedMessage }}</p>
    </section>

    <section class="surface p-6">
      <h2 class="text-sm font-medium text-content-strong">Where things show up</h2>
      <dl class="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div><dt class="text-content-muted">Currently working on</dt><dd class="text-content">Homepage, under the hero. Two active items maximum.</dd></div>
        <div><dt class="text-content-muted">Featured projects</dt><dd class="text-content">Homepage Selected work, plus the projects page.</dd></div>
        <div><dt class="text-content-muted">Skills</dt><dd class="text-content">Stack page, grouped by category. First ten on the homepage.</dd></div>
        <div><dt class="text-content-muted">Profile &amp; resume</dt><dd class="text-content">Hero, footer, page metadata and every Resume button.</dd></div>
      </dl>
    </section>
  </div>
</template>
