<script setup lang="ts">
<<<<<<< HEAD
import { useUpload } from '../../composables/useUpload'

=======
>>>>>>> b87402ff7d3b4eb2de4ce096e6bfc16a4c5f65e7
const props = defineProps<{ id: string; modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const { progress, uploading, error, uploadImage } = useUpload()
const picker = ref<HTMLInputElement | null>(null)

async function onPick(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  try {
    emit('update:modelValue', await uploadImage(file))
  } catch {
    // useUpload surfaces the message through `error`.
  }
}
</script>

<template>
  <div class="space-y-3">
    <div class="flex gap-3">
      <div class="grid h-20 w-32 shrink-0 place-items-center overflow-hidden rounded-lg border border-line bg-raised">
        <img v-if="modelValue" :src="modelValue" alt="" class="h-full w-full object-cover" />
        <AppIcon v-else name="image" :size="22" class="text-content-muted" />
      </div>

      <div class="flex-1 space-y-2">
        <input
          :id="props.id"
          type="url"
          class="field"
          placeholder="https://… or upload a file"
          :value="modelValue"
          @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        />
        <div class="flex items-center gap-2">
          <button type="button" class="btn-secondary btn-sm" :disabled="uploading" @click="picker?.click()">
            <AppIcon name="image" :size="15" />
            {{ uploading ? `Uploading ${progress}%` : 'Upload' }}
          </button>
          <button
            v-if="modelValue"
            type="button"
            class="btn-ghost btn-sm text-content-muted"
            @click="emit('update:modelValue', '')"
          >
            Clear
          </button>
        </div>
      </div>
    </div>

    <input
      ref="picker"
      type="file"
      accept="image/jpeg,image/png,image/webp,image/gif"
      class="sr-only"
      @change="onPick"
    />

    <div v-if="uploading" class="h-1 overflow-hidden rounded-full bg-line">
      <div class="h-full bg-accent transition-all" :style="{ width: `${progress}%` }" />
    </div>

    <p v-if="error" class="text-2xs text-danger">{{ error }}</p>
    <p v-else class="text-2xs text-content-muted">JPG, PNG, WebP or GIF, up to 5 MB.</p>
  </div>
</template>
