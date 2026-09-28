<script setup lang="ts">
export interface FieldSchema {
  key: string
  label: string
  type: 'text' | 'textarea' | 'url' | 'tags' | 'image' | 'toggle' | 'number'
  help?: string
  required?: boolean
  placeholder?: string
}

const props = defineProps<{ field: FieldSchema; modelValue: unknown }>()
const emit = defineEmits<{ 'update:modelValue': [value: unknown] }>()

const id = `field-${props.field.key}`

const text = computed({
  get: () => (props.modelValue as string) ?? '',
  set: (value: string) => emit('update:modelValue', value),
})

const flag = computed({
  get: () => Boolean(props.modelValue),
  set: (value: boolean) => emit('update:modelValue', value),
})

const number = computed({
  get: () => (props.modelValue as number) ?? 0,
  set: (value: string) => emit('update:modelValue', Number(value) || 0),
})

// Tags are stored as an array but edited as a comma-separated string.
const tags = computed({
  get: () => ((props.modelValue as string[]) ?? []).join(', '),
  set: (value: string) =>
    emit(
      'update:modelValue',
      value.split(',').map((t) => t.trim()).filter(Boolean),
    ),
})
</script>

<template>
  <div>
    <label :for="id" class="field-label">
      {{ field.label }}
      <span v-if="field.required" class="text-accent">*</span>
    </label>

    <ImageField v-if="field.type === 'image'" :id="id" v-model="text" />

    <label v-else-if="field.type === 'toggle'" class="flex cursor-pointer items-center gap-3">
      <input :id="id" v-model="flag" type="checkbox" class="peer sr-only" />
      <span
        class="relative h-6 w-11 rounded-full bg-line transition peer-checked:bg-accent
               after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full
               after:bg-ink after:transition peer-checked:after:translate-x-5"
      />
      <span class="text-sm text-content">{{ flag ? 'On' : 'Off' }}</span>
    </label>

    <textarea
      v-else-if="field.type === 'textarea'"
      :id="id"
      v-model="text"
      rows="4"
      class="field resize-y"
      :placeholder="field.placeholder"
      :required="field.required"
    />

    <input
      v-else-if="field.type === 'tags'"
      :id="id"
      v-model="tags"
      type="text"
      class="field"
      placeholder="Nuxt, TypeScript, Tailwind CSS"
    />

    <input
      v-else-if="field.type === 'number'"
      :id="id"
      v-model="number"
      type="number"
      class="field"
    />

    <input
      v-else
      :id="id"
      v-model="text"
      :type="field.type === 'url' ? 'url' : 'text'"
      class="field"
      :placeholder="field.placeholder"
      :required="field.required"
    />

    <p v-if="field.help" class="mt-1.5 text-2xs text-content-muted">{{ field.help }}</p>
  </div>
</template>
