<script setup lang="ts">
const props = defineProps<{ id: string; modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

// If the link doesn't load as an image, say so instead of showing a blank box.
const broken = ref(false)
watch(() => props.modelValue, () => (broken.value = false))
</script>

<template>
  <div class="space-y-3">
    <div class="flex gap-3">
      <div class="grid h-20 w-32 shrink-0 place-items-center overflow-hidden rounded-lg border border-line bg-raised">
        <img
          v-if="modelValue && !broken"
          :src="modelValue"
          alt=""
          class="h-full w-full object-cover"
          @error="broken = true"
        />
        <AppIcon v-else name="image" :size="22" class="text-content-muted" />
      </div>

      <div class="flex-1 space-y-2">
        <input
          :id="props.id"
          type="text"
          inputmode="url"
          autocomplete="off"
          spellcheck="false"
          class="field"
          placeholder="https://i.ibb.co/… or /images/photo.jpg"
          :value="modelValue"
          @input="emit('update:modelValue', ($event.target as HTMLInputElement).value.trim())"
        />
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

    <p v-if="modelValue && broken" class="text-2xs text-danger">
      This link didn't load as an image. Use a direct link to the image file that anyone can open.
    </p>
    <p v-else class="text-2xs text-content-muted">
      Paste an image link (for example from ImgBB), or a path to a file in your public folder such as /images/photo.jpg.
    </p>
  </div>
</template>