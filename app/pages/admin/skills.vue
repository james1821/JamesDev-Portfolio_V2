<script setup lang="ts">
import type { FieldSchema } from '~/components/admin/FormField.vue'

definePageMeta({ layout: 'admin' })

const fields: FieldSchema[] = [
  { key: 'name', label: 'Name', type: 'text', required: true },
  { key: 'category', label: 'Category', type: 'text', required: true, help: 'Skills group under this heading on the stack page — reuse existing spellings.' },
  { key: 'icon', label: 'Icon', type: 'image', help: 'Devicon SVG URLs work well: cdn.jsdelivr.net/gh/devicons/devicon' },
]
</script>

<template>
  <CrudPanel
    collection="skills"
    title="Skills"
    description="The first ten by order also appear in the homepage stack strip."
    :fields="fields"
    label-key="name"
    subtitle-key="category"
    image-key="icon"
  />
</template>
