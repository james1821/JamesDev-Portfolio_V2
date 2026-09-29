<script setup lang="ts">
import type { FieldSchema } from '~/components/admin/FormField.vue'

definePageMeta({ layout: 'admin' })

const fields: FieldSchema[] = [
  { key: 'title', label: 'Title', type: 'text', required: true },
  { key: 'issuer', label: 'Issuer', type: 'text', required: true },
  { key: 'date', label: 'Date earned', type: 'text', required: true, placeholder: 'August 2023' },
  { key: 'issuerLogo', label: 'Issuer logo', type: 'image' },
  { key: 'description', label: 'What it covered', type: 'textarea' },
  { key: 'link', label: 'Credential URL', type: 'url', placeholder: 'https://' },
]
</script>

<template>
  <CrudPanel
    collection="certifications"
    title="Certifications"
    description="Each card links out to the credential the provider issued."
    :fields="fields"
    label-key="title"
    subtitle-key="issuer"
  />
</template>
