<script setup lang="ts">
import type { FieldSchema } from '~/components/admin/FormField.vue'

definePageMeta({ layout: 'admin' })

const fields: FieldSchema[] = [
  { key: 'title', label: 'Title', type: 'text', required: true },
  { key: 'active', label: 'Show on the homepage', type: 'toggle' },
  { key: 'description', label: 'Short description', type: 'textarea', required: true, help: 'One or two sentences. Long text is clamped to three lines on the card.' },
  { key: 'image', label: 'Image or GIF', type: 'image', help: 'An animated GIF works here and often reads better than a static screenshot.' },
]
</script>

<template>
  <CrudPanel
    collection="currentWork"
    title="Currently working on"
    description="Up to two active items render on the homepage, directly under the hero."
    :fields="fields"
    label-key="title"
    subtitle-key="description"
    image-key="image"
    :max="4"
  />
</template>
