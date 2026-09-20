<script setup lang="ts">
import type { CollectionName } from '#shared/types'
import type { FieldSchema } from './FormField.vue'

interface Record {
  id: string
  order?: number
  [key: string]: unknown
}

const props = defineProps<{
  collection: CollectionName
  title: string
  description: string
  fields: FieldSchema[]
  /** Which field to show as the row heading in the list. */
  labelKey: string
  subtitleKey?: string
  imageKey?: string
  /** Hard cap on records, used by the two-item Currently Working On section. */
  max?: number
}>()

const { items, loading, error, create, update, remove, move, nextOrder } =
  useAdminCollection<Record>(props.collection)

const editing = ref<Record | null>(null)
const formOpen = ref(false)
const draft = ref<Record>({ id: '' })
const saving = ref(false)
const confirmingId = ref('')
const formError = ref('')

const atCapacity = computed(() => Boolean(props.max && items.value.length >= props.max))

function blank(): Record {
  const record: Record = { id: '', order: nextOrder() }
  for (const field of props.fields) {
    record[field.key] = field.type === 'tags' ? [] : field.type === 'toggle' ? false : ''
  }
  return record
}

function startCreate() {
  formError.value = ''
  editing.value = null
  draft.value = blank()
  formOpen.value = true
}

function startEdit(item: Record) {
  formError.value = ''
  editing.value = item
  draft.value = { ...item }
  formOpen.value = true
}

function cancel() {
  editing.value = null
  draft.value = { id: '' }
  formError.value = ''
  formOpen.value = false
}

async function save() {
  const missing = props.fields.filter((f) => f.required && !String(draft.value[f.key] ?? '').trim())
  if (missing.length) {
    formError.value = `Fill in: ${missing.map((f) => f.label).join(', ')}.`
    return
  }

  saving.value = true
  formError.value = ''

  const { id, ...payload } = draft.value

  try {
    if (editing.value) await update(editing.value.id, payload)
    else await create(payload as Omit<Record, 'id'>)
    cancel()
  } catch (err) {
    formError.value = err instanceof Error ? err.message : 'Could not save this record.'
  } finally {
    saving.value = false
  }
}

async function confirmRemove(id: string) {
  if (confirmingId.value !== id) {
    confirmingId.value = id
    return
  }
  await remove(id)
  confirmingId.value = ''
  if (editing.value?.id === id) cancel()
}

</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-xl font-semibold text-content-strong">{{ title }}</h1>
        <p class="lede mt-1 text-sm">{{ description }}</p>
      </div>
      <button
        type="button"
        class="btn-primary btn-sm"
        :disabled="atCapacity"
        :title="atCapacity ? `This section holds at most ${max} items.` : undefined"
        @click="startCreate"
      >
        <AppIcon name="plus" :size="15" />
        Add
      </button>
    </div>

    <p v-if="atCapacity" class="chip border-warn/40 text-warn">
      Showing the maximum of {{ max }}. Remove one before adding another.
    </p>

    <form v-if="formOpen" class="surface space-y-5 p-6" @submit.prevent="save">
      <h2 class="text-sm font-medium text-content-strong">
        {{ editing ? `Editing ${String(editing[labelKey] ?? 'record')}` : 'New record' }}
      </h2>

      <div class="grid gap-5 sm:grid-cols-2">
        <FormField
          v-for="field in fields"
          :key="field.key"
          v-model="draft[field.key]"
          :field="field"
          :class="['textarea', 'image'].includes(field.type) ? 'sm:col-span-2' : ''"
        />
      </div>

      <p v-if="formError" class="text-sm text-danger">{{ formError }}</p>

      <div class="flex gap-2">
        <button type="submit" class="btn-primary btn-sm" :disabled="saving">
          <AppIcon name="check" :size="15" />
          {{ saving ? 'Saving…' : editing ? 'Save changes' : 'Create' }}
        </button>
        <button type="button" class="btn-ghost btn-sm" @click="cancel">Cancel</button>
      </div>
    </form>

    <div v-if="loading" class="space-y-3">
      <div v-for="n in 3" :key="n" class="skeleton h-20" />
    </div>

    <p v-else-if="error" class="surface border-danger/30 p-5 text-sm text-danger">{{ error }}</p>

    <p v-else-if="!items.length" class="surface p-8 text-center text-sm text-content">
      Nothing here yet. Add the first record to see it on the site.
    </p>

    <ul v-else class="space-y-3">
      <li v-for="(item, index) in items" :key="item.id" class="surface flex items-center gap-4 p-4">
        <img
          v-if="imageKey && item[imageKey]"
          :src="String(item[imageKey])"
          alt=""
          class="h-12 w-20 shrink-0 rounded-md border border-line object-cover"
        />

        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-medium text-content-strong">{{ item[labelKey] }}</p>
          <p v-if="subtitleKey" class="truncate text-2xs text-content-muted">{{ item[subtitleKey] }}</p>
        </div>

        <div class="flex shrink-0 items-center gap-1">
          <button
            type="button"
            class="btn-ghost btn-sm"
            :disabled="index === 0"
            @click="move(item.id, -1)"
          >
            <AppIcon name="up" :size="15" />
            <span class="sr-only">Move up</span>
          </button>
          <button
            type="button"
            class="btn-ghost btn-sm"
            :disabled="index === items.length - 1"
            @click="move(item.id, 1)"
          >
            <AppIcon name="down" :size="15" />
            <span class="sr-only">Move down</span>
          </button>
          <button type="button" class="btn-ghost btn-sm" @click="startEdit(item)">
            <AppIcon name="edit" :size="15" />
            <span class="sr-only">Edit</span>
          </button>
          <button
            type="button"
            class="btn-sm"
            :class="confirmingId === item.id ? 'btn-danger' : 'btn-ghost'"
            @click="confirmRemove(item.id)"
            @blur="confirmingId = ''"
          >
            <AppIcon v-if="confirmingId !== item.id" name="trash" :size="15" />
            <span :class="confirmingId === item.id ? '' : 'sr-only'">
              {{ confirmingId === item.id ? 'Confirm delete' : 'Delete' }}
            </span>
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>
