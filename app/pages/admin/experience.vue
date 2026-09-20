<script setup lang="ts">
import type { FieldSchema } from '~/components/admin/FormField.vue'

definePageMeta({ layout: 'admin' })

const fields: FieldSchema[] = [
  { key: 'role', label: 'Role', type: 'text', required: true },
  { key: 'company', label: 'Company', type: 'text', required: true },
  { key: 'startDate', label: 'Start', type: 'text', required: true, placeholder: 'Feb 2023' },
  { key: 'endDate', label: 'End', type: 'text', required: true, placeholder: 'Present' },
  { key: 'companyLogo', label: 'Company logo', type: 'image' },
  { key: 'description', label: 'What you did', type: 'textarea', required: true, help: 'Lead with what shipped, not the job description.' },
  { key: 'tech', label: 'Technologies', type: 'tags' },
]
</script>

<template>
  <CrudPanel
    collection="experience"
    title="Work experience"
    description="Ordered top to bottom exactly as the timeline renders them."
    :fields="fields"
    label-key="role"
    subtitle-key="company"
  />
</template>
