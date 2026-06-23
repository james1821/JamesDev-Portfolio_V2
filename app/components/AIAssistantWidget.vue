<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { SparklesIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/vue/24/solid'
import type { PortfolioData } from '~/types'
import type { AssistantReply } from '~/utils/portfolioAssistant'

const props = defineProps<{ portfolio: PortfolioData }>()

const { isOpen, close, toggle } = useAIAssistant()

interface ChatMessage {
  id: number
  role: 'user' | 'bot'
  text?: string
  reply?: AssistantReply
}

let idCounter = 0
function nextId() {
  idCounter += 1
  return idCounter
}

const firstName = props.portfolio.personal.name.split(' ')[0] ?? props.portfolio.personal.name

const messages = ref<ChatMessage[]>([
  {
    id: nextId(),
    role: 'bot',
    reply: {
      text: `Hi! I’m ${firstName}’s portfolio assistant 🤖 Ask me anything about skills, experience, projects, certifications, or how to get in touch.`,
    },
  },
])

const draft = ref('')
const isThinking = ref(false)
const scrollEl = ref<HTMLElement | null>(null)
const lastSendAt = ref(0)
const COOLDOWN_MS = 1800

const suggestions = ['Skills', 'Experience', 'Projects', 'Certifications', 'Contact']

function scrollToBottom() {
  nextTick(() => {
    if (scrollEl.value) scrollEl.value.scrollTop = scrollEl.value.scrollHeight
  })
}

function historyForApi() {
  return messages.value
    .slice(-10)
    .map((m) => ({
      role: m.role,
      text: m.role === 'user' ? (m.text ?? '') : (m.reply?.text ?? ''),
    }))
    .filter((m) => m.text)
}

function withFallbackNote(reply: AssistantReply): AssistantReply {
  const fallbackNote = 'Quick local answer — the smart assistant is briefly busy.'
  return { ...reply, note: reply.note ? `${reply.note}\n${fallbackNote}` : fallbackNote }
}

async function send(rawText: string) {
  const trimmed = rawText.trim()
  if (!trimmed || isThinking.value) return

  const now = Date.now()
  if (now - lastSendAt.value < COOLDOWN_MS) return
  lastSendAt.value = now

  const history = historyForApi()

  messages.value.push({ id: nextId(), role: 'user', text: trimmed })
  draft.value = ''
  scrollToBottom()

  isThinking.value = true

  try {
    const res = await $fetch<{ ok: boolean; text?: string }>('/api/assistant', {
      method: 'POST',
      body: { message: trimmed, history },
    })

    if (res.ok && res.text) {
      messages.value.push({ id: nextId(), role: 'bot', reply: { text: res.text } })
    } else {
      messages.value.push({
        id: nextId(),
        role: 'bot',
        reply: withFallbackNote(generateAssistantReply(trimmed, props.portfolio)),
      })
    }
  } catch {
    messages.value.push({
      id: nextId(),
      role: 'bot',
      reply: withFallbackNote(generateAssistantReply(trimmed, props.portfolio)),
    })
  } finally {
    isThinking.value = false
    scrollToBottom()
  }
}

function handleSend() {
  send(draft.value)
}

function sendSuggestion(label: string) {
  send(label)
}
</script>

<template>
  <button
    v-if="!isOpen"
    class="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-accent text-bg
           flex items-center justify-center shadow-xl shadow-accent-glow
           hover:bg-accent-dim hover:scale-105 active:scale-95 transition-all duration-200"
    aria-label="Open AI portfolio assistant"
    @click="toggle"
  >
    <SparklesIcon class="w-6 h-6" />
    <span class="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-accent border-2 border-bg animate-pulse-slow" />
  </button>

  <Transition name="ai-panel">
    <div
      v-if="isOpen"
      class="fixed bottom-5 right-5 z-50 w-[92vw] max-w-sm h-[min(640px,75vh)]
             bg-bg-card border border-border rounded-2xl shadow-2xl shadow-accent-glow
             flex flex-col overflow-hidden"
    >
      <div class="flex items-center gap-3 p-4 border-b border-border flex-shrink-0">
        <div class="w-9 h-9 rounded-full bg-accent-glow border border-border-accent flex items-center justify-center flex-shrink-0">
          <SparklesIcon class="w-4 h-4 text-accent" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-display font-semibold text-sm text-text-primary leading-tight">Portfolio Assistant</p>
          <p class="font-mono text-[10.5px] text-text-muted">AI-powered · auto-fallback if busy</p>
        </div>
        <button
          class="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted
                 hover:text-accent hover:bg-bg-elevated transition-colors duration-200"
          aria-label="Close assistant"
          @click="close"
        >
          <XMarkIcon class="w-4 h-4" />
        </button>
      </div>

      <div ref="scrollEl" class="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
        <div
          v-for="m in messages"
          :key="m.id"
          class="flex"
          :class="m.role === 'user' ? 'justify-end' : 'justify-start'"
        >
          <div v-if="m.role === 'bot'" class="flex gap-2 max-w-[88%]">
            <div class="w-6 h-6 rounded-full bg-accent-glow border border-border-accent flex items-center justify-center flex-shrink-0 mt-0.5">
              <SparklesIcon class="w-3 h-3 text-accent" />
            </div>
            <div class="bg-bg-elevated border border-border rounded-xl rounded-tl-sm px-3.5 py-2.5 min-w-0">
              <p class="font-display text-sm text-text-secondary leading-relaxed whitespace-pre-line">{{ m.reply?.text }}</p>

              <ul v-if="m.reply?.items?.length" class="mt-2.5 space-y-1.5">
                <li v-for="(item, i) in m.reply.items" :key="i">
                  <a
                    v-if="item.href"
                    :href="item.href"
                    target="_blank"
                    rel="noopener"
                    class="block font-display text-xs font-medium text-accent hover:text-accent-dim hover:underline underline-offset-2 transition-colors"
                  >
                    {{ item.label }}
                    <span v-if="item.sub" class="block font-mono text-[11px] text-text-muted font-normal break-all">{{ item.sub }}</span>
                  </a>
                  <div v-else class="font-display text-xs font-medium text-text-primary">
                    {{ item.label }}
                    <span v-if="item.sub" class="block font-mono text-[11px] text-text-muted font-normal mt-0.5">{{ item.sub }}</span>
                  </div>
                </li>
              </ul>

              <pre
                v-if="m.reply?.code"
                class="mt-2.5 font-mono text-[10px] leading-snug text-text-secondary bg-bg/70 border border-border rounded-lg p-2.5 overflow-x-auto max-h-52 whitespace-pre"
              >{{ m.reply.code }}</pre>

              <p v-if="m.reply?.note" class="mt-2 font-mono text-[10.5px] text-text-muted/80">{{ m.reply.note }}</p>
            </div>
          </div>

          <div v-else class="bg-accent text-bg rounded-xl rounded-tr-sm px-3.5 py-2.5 max-w-[85%]">
            <p class="font-display text-sm leading-relaxed">{{ m.text }}</p>
          </div>
        </div>

        <div v-if="isThinking" class="flex gap-2">
          <div class="w-6 h-6 rounded-full bg-accent-glow border border-border-accent flex items-center justify-center flex-shrink-0">
            <SparklesIcon class="w-3 h-3 text-accent" />
          </div>
          <div class="bg-bg-elevated border border-border rounded-xl rounded-tl-sm px-3.5 py-3 flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style="animation-delay: 0ms" />
            <span class="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style="animation-delay: 120ms" />
            <span class="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style="animation-delay: 240ms" />
          </div>
        </div>
      </div>

      <div v-if="messages.length <= 1" class="flex gap-1.5 px-4 pb-3 overflow-x-auto scrollbar-hide flex-shrink-0">
        <button
          v-for="s in suggestions"
          :key="s"
          class="flex-shrink-0 font-mono text-[11px] px-2.5 py-1 rounded-full border border-border text-text-secondary
                 hover:border-accent hover:text-accent transition-colors duration-200"
          @click="sendSuggestion(s)"
        >
          {{ s }}
        </button>
      </div>

      <div class="flex items-center gap-2 p-3 border-t border-border flex-shrink-0">
        <input
          v-model="draft"
          type="text"
          placeholder="Ask about skills, projects…"
          class="flex-1 min-w-0 bg-bg border border-border rounded-lg px-3 py-2 text-sm font-display text-text-primary
                 placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
          @keydown.enter="handleSend"
        />
        <button
          :disabled="!draft.trim() || isThinking"
          class="w-9 h-9 rounded-lg bg-accent text-bg flex items-center justify-center flex-shrink-0
                 hover:bg-accent-dim transition-all duration-200 active:scale-95
                 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Send message"
          @click="handleSend"
        >
          <PaperAirplaneIcon class="w-4 h-4" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.ai-panel-enter-active,
.ai-panel-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.ai-panel-enter-from,
.ai-panel-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.97);
}
</style>
