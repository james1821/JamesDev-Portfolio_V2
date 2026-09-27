<script setup lang="ts">
import type { Personal } from '#shared/types'
import { useConfigDoc } from '../../composables/useConfigDoc'
import { useUpload } from '../../composables/useUpload'

definePageMeta({ layout: 'admin' })

const EMPTY: Personal & { resumeText?: string } = {
  name: '', title: '', summary: '', photo: '', email: '',
  linkedin: '', github: '', resume: '', location: '', availability: '',
}

const site = useConfigDoc('site', EMPTY)
const assistant = useConfigDoc('assistant', { resumeText: '' })

const { uploadResume, uploading, progress, error: uploadError } = useUpload()
const resumePicker = ref<HTMLInputElement | null>(null)

async function onResumePick(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  try {
    site.data.value.resume = await uploadResume(file)
    await site.save()
  } catch {
    // useUpload reports the reason through uploadError.
  }
}
</script>

<template>
  <div class="space-y-10">
    <section>
      <h1 class="text-xl font-semibold text-content-strong">Profile</h1>
      <p class="lede mt-1 text-sm">Everything in the hero, footer and page metadata comes from here.</p>

      <div v-if="site.loading.value" class="mt-6 space-y-3">
        <div v-for="n in 4" :key="n" class="skeleton h-12" />
      </div>

      <form v-else class="surface mt-6 space-y-5 p-6" @submit.prevent="site.save()">
        <div class="grid gap-5 sm:grid-cols-2">
          <div>
            <label for="s-name" class="field-label">Name</label>
            <input id="s-name" v-model="site.data.value.name" class="field" required />
          </div>
          <div>
            <label for="s-title" class="field-label">Role</label>
            <input id="s-title" v-model="site.data.value.title" class="field" required />
          </div>
          <div>
            <label for="s-email" class="field-label">Email</label>
            <input id="s-email" v-model="site.data.value.email" type="email" class="field" required />
          </div>
          <div>
            <label for="s-location" class="field-label">Location</label>
            <input id="s-location" v-model="site.data.value.location" class="field" placeholder="Philippines · Remote" />
          </div>
          <div>
            <label for="s-availability" class="field-label">Availability badge</label>
            <input id="s-availability" v-model="site.data.value.availability" class="field" placeholder="Open to full-stack roles" />
            <p class="mt-1.5 text-2xs text-content-muted">Leave empty to hide the badge above your name.</p>
          </div>
          <div>
            <label for="s-linkedin" class="field-label">LinkedIn URL</label>
            <input id="s-linkedin" v-model="site.data.value.linkedin" type="url" class="field" />
          </div>
          <div>
            <label for="s-github" class="field-label">GitHub URL</label>
            <input id="s-github" v-model="site.data.value.github" type="url" class="field" />
          </div>
        </div>

        <div>
          <label for="s-summary" class="field-label">Summary</label>
          <textarea id="s-summary" v-model="site.data.value.summary" rows="5" class="field resize-y" required />
          <p class="mt-1.5 text-2xs text-content-muted">Used in the hero, the meta description and the assistant's record.</p>
        </div>

        <div>
          <span class="field-label">Portrait</span>
          <ImageField id="s-photo" v-model="site.data.value.photo" />
        </div>

        <p v-if="site.error.value" class="text-sm text-danger">{{ site.error.value }}</p>
        <p v-else-if="site.message.value" class="text-sm text-accent-soft">{{ site.message.value }}</p>

        <button type="submit" class="btn-primary btn-sm" :disabled="site.saving.value">
          <AppIcon name="check" :size="15" />
          {{ site.saving.value ? 'Saving…' : 'Save profile' }}
        </button>
      </form>
    </section>

    <section>
      <h2 class="text-lg font-semibold text-content-strong">Resume</h2>
      <p class="lede mt-1 text-sm">Uploading a new PDF replaces the file behind every Resume button on the site.</p>

      <div class="surface mt-5 space-y-4 p-6">
        <div class="flex flex-wrap items-center gap-3">
          <span class="grid h-11 w-11 place-items-center rounded-xl border border-line bg-raised text-accent">
            <AppIcon name="file" :size="18" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm text-content-strong">
              {{ site.data.value.resume || 'No resume uploaded yet' }}
            </p>
            <p class="text-2xs text-content-muted">PDF, up to 10 MB.</p>
          </div>
          <a v-if="site.data.value.resume" :href="site.data.value.resume" target="_blank" rel="noopener" class="btn-ghost btn-sm">
            <AppIcon name="external" :size="15" />
            Open
          </a>
          <button type="button" class="btn-secondary btn-sm" :disabled="uploading" @click="resumePicker?.click()">
            <AppIcon name="download" :size="15" />
            {{ uploading ? `Uploading ${progress}%` : 'Replace' }}
          </button>
        </div>

        <input ref="resumePicker" type="file" accept="application/pdf" class="sr-only" @change="onResumePick" />
        <div v-if="uploading" class="h-1 overflow-hidden rounded-full bg-line">
          <div class="h-full bg-accent transition-all" :style="{ width: `${progress}%` }" />
        </div>
        <p v-if="uploadError" class="text-2xs text-danger">{{ uploadError }}</p>
      </div>
    </section>

    <section>
      <h2 class="text-lg font-semibold text-content-strong">Assistant knowledge</h2>
      <p class="lede mt-1 text-sm">
        Paste your resume text here. The assistant already knows your projects, roles and skills from the
        collections — this fills in what only the PDF says, like education or specific numbers.
      </p>

      <form class="surface mt-5 space-y-4 p-6" @submit.prevent="assistant.save()">
        <label for="a-resume" class="field-label">Resume text</label>
        <textarea
          id="a-resume"
          v-model="assistant.data.value.resumeText"
          rows="10"
          class="field resize-y font-mono text-2xs"
          placeholder="Paste the plain text of your resume…"
        />
        <p v-if="assistant.message.value" class="text-sm text-accent-soft">{{ assistant.message.value }}</p>
        <button type="submit" class="btn-primary btn-sm" :disabled="assistant.saving.value">
          <AppIcon name="check" :size="15" />
          {{ assistant.saving.value ? 'Saving…' : 'Save knowledge' }}
        </button>
      </form>
    </section>
  </div>
</template>
