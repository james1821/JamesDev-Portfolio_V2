<script setup lang="ts">
import type { FieldSchema } from '~/components/admin/FormField.vue'

definePageMeta({ layout: 'admin' })

const fields: FieldSchema[] = [
  { key: 'title', label: 'Title', type: 'text', required: true },
  { key: 'featured', label: 'Show on the homepage', type: 'toggle' },
  { key: 'description', label: 'Description', type: 'textarea', required: true, help: 'Two or three sentences on what you built and why it mattered.' },
  { key: 'image', label: 'Cover image', type: 'image' },
  { key: 'tech', label: 'Technologies', type: 'tags', help: 'Comma separated. These become the filter options on the projects page.' },
  { key: 'demo', label: 'Live URL', type: 'url', placeholder: 'https://' },
  { key: 'github', label: 'Source URL', type: 'url', placeholder: 'https://github.com/' },
]
</script>

<template>
  <CrudPanel
    collection="projects"
    title="Projects"
    description="Anything marked as featured also appears in Selected work on the homepage."
    :fields="fields"
    label-key="title"
    subtitle-key="description"
    image-key="image"
  />
</template>
