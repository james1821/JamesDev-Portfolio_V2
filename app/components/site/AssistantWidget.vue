<script setup lang="ts">
import type { Personal } from '#shared/types'
import { useAssistant } from '../../composables/useAssistant'

const props = defineProps<{ personal: Personal }>()

const { isOpen, messages, pending, remaining, close, toggle, ask, greet } = useAssistant()

const draft = ref('')
const log = ref<HTMLElement | null>(null)
const input = ref<HTMLTextAreaElement | null>(null)

const firstName = computed(() => props.personal.name.split(' ')[0] ?? props.personal.name)
const exhausted = computed(() => remaining.value <= 0)

const prompts = ['What has he built recently?', 'Which stack does he use?', 'Is he open to work?']

function scrollLog() {
  nextTick(() => log.value?.scrollTo({ top: log.value.scrollHeight, behavior: 'smooth' }))
}

async function submit(text: string) {
  draft.value = ''
  await ask(text)
  scrollLog()
}

watch(isOpen, (open) => {
  if (!open) return
  greet(firstName.value)
  nextTick(() => input.value?.focus())
})

watch(messages, scrollLog, { deep: true })

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isOpen.value) close()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div>
    <button
      v-show="!isOpen"
      type="button"
      class="fixed bottom-5 right-5 z-50 grid h-13 w-13 place-items-center gap-2 rounded-full
             bg-accent px-4 py-3.5 text-ink shadow-lift transition
             hover:bg-accent-soft active:scale-95 sm:w-auto sm:grid-flow-col"
      @click="toggle"
    >
      <AppIcon name="sparkles" :size="18" />
      <span class="hidden text-sm font-medium sm:inline">Ask about {{ firstName }}</span>
      <span class="sr-only sm:hidden">Open the portfolio assistant</span>
    </button>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-3 opacity-0"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="translate-y-2 opacity-0"
    >
      <div
        v-if="isOpen"
        role="dialog"
        aria-modal="false"
        aria-label="Portfolio assistant"
        class="surface fixed bottom-4 right-4 z-50 flex h-[min(600px,78vh)] w-[calc(100vw-2rem)]
               max-w-sm flex-col overflow-hidden shadow-lift"
      >
        <header class="flex items-center gap-3 border-b border-line px-4 py-3">
          <span class="grid h-8 w-8 place-items-center rounded-lg bg-accent-wash text-accent">
            <AppIcon name="sparkles" :size="16" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-content-strong">Portfolio assistant</p>
            <p class="font-mono text-2xs text-content-muted">
              {{ remaining }} of 5 questions left
            </p>
          </div>
          <button type="button" class="btn-ghost btn-sm" @click="close">
            <AppIcon name="close" :size="16" />
            <span class="sr-only">Close assistant</span>
          </button>
        </header>

        <div ref="log" class="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
          <div
            v-for="message in messages"
            :key="message.id"
            class="flex"
            :class="message.role === 'visitor' ? 'justify-end' : 'justify-start'"
          >
            <p
              class="max-w-[85%] whitespace-pre-wrap rounded-xl px-3.5 py-2.5 text-sm leading-relaxed"
              :class="message.role === 'visitor'
                ? 'bg-accent text-ink'
                : message.failed
                  ? 'border border-danger/30 bg-danger/10 text-content-strong'
                  : 'border border-line bg-raised text-content'"
            >
              {{ message.text }}
            </p>
          </div>

          <div v-if="pending" class="flex gap-1.5 px-1" aria-label="Thinking">
            <span v-for="dot in 3" :key="dot" class="h-1.5 w-1.5 animate-breathe rounded-full bg-accent"
              :style="{ animationDelay: `${dot * 140}ms` }" />
          </div>
        </div>

        <div v-if="messages.length <= 1 && !exhausted" class="flex flex-wrap gap-1.5 px-4 pb-3">
          <button
            v-for="prompt in prompts"
            :key="prompt"
            type="button"
            class="chip transition hover:border-accent/50 hover:text-accent-soft"
            @click="submit(prompt)"
          >
            {{ prompt }}
          </button>
        </div>

        <form class="border-t border-line p-3" @submit.prevent="submit(draft)">
          <div class="flex items-end gap-2">
            <label class="sr-only" for="assistant-input">Your question</label>
            <textarea
              id="assistant-input"
              ref="input"
              v-model="draft"
              rows="1"
              :disabled="pending || exhausted"
              :placeholder="exhausted ? `Email ${personal.email}` : 'Ask a question…'"
              class="field max-h-28 min-h-[42px] resize-none py-2.5"
              @keydown.enter.exact.prevent="submit(draft)"
            />
            <button
              type="submit"
              class="btn-primary h-[42px] w-[42px] p-0"
              :disabled="pending || exhausted || !draft.trim()"
            >
              <AppIcon name="send" :size="17" />
              <span class="sr-only">Send question</span>
            </button>
          </div>
          <p class="mt-2 text-2xs text-content-muted">
            Answers come from this site's content and can be imperfect.
          </p>
        </form>
      </div>
    </Transition>
  </div>
</template>
