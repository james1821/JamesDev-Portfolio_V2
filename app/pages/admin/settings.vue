<script setup lang="ts">
import type { Personal } from '#shared/types'
<<<<<<< HEAD
import { useConfigDoc } from '../../composables/useConfigDoc'
<<<<<<< HEAD
=======
import { useUpload } from '../../composables/useUpload'
=======
>>>>>>> b87402ff7d3b4eb2de4ce096e6bfc16a4c5f65e7
>>>>>>> origin/main

definePageMeta({ layout: 'admin' })

const EMPTY: Personal & { resumeText?: string } = {
  name: '', title: '', summary: '', photo: '', email: '',
  linkedin: '', github: '', resume: '', location: '', availability: '',
}

const site = useConfigDoc('site', EMPTY)
const assistant = useConfigDoc('assistant', { resumeText: '' })
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
      <p class="lede mt-1 text-sm">The link behind every Resume button on the site.</p>

      <form class="surface mt-5 space-y-4 p-6" @submit.prevent="site.save()">
        <div class="flex flex-wrap items-center gap-3">
          <span class="grid h-11 w-11 place-items-center rounded-xl border border-line bg-raised text-accent">
            <AppIcon name="file" :size="18" />
          </span>
          <div class="min-w-0 flex-1">
            <label for="s-resume" class="field-label">Resume link</label>
            <input
              id="s-resume"
              v-model.trim="site.data.value.resume"
              type="text"
              inputmode="url"
              autocomplete="off"
              spellcheck="false"
              class="field"
              placeholder="/resume/YourName_Resume.pdf or https://…"
            />
          </div>
          <a
            v-if="site.data.value.resume"
            :href="site.data.value.resume"
            target="_blank"
            rel="noopener"
            class="btn-ghost btn-sm self-end"
          >
            <AppIcon name="external" :size="15" />
            Open
          </a>
        </div>

        <p class="text-2xs text-content-muted">
          Easiest: put the PDF in your project's public/resume folder and enter /resume/FileName.pdf. Or paste a
          public link, such as a Google Drive share link set to "Anyone with the link".
        </p>

        <p v-if="site.error.value" class="text-sm text-danger">{{ site.error.value }}</p>
        <p v-else-if="site.message.value" class="text-sm text-accent-soft">{{ site.message.value }}</p>

        <button type="submit" class="btn-primary btn-sm" :disabled="site.saving.value">
          <AppIcon name="check" :size="15" />
          {{ site.saving.value ? 'Saving…' : 'Save resume link' }}
        </button>
      </form>
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