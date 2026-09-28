import type { AssistantReply } from '#shared/types'

export interface ChatMessage {
  id: number
  role: 'visitor' | 'assistant'
  text: string
  failed?: boolean
}

const STORAGE_KEY = 'portfolio-assistant-session'

const isOpen = ref(false)
const messages = ref<ChatMessage[]>([])
const pending = ref(false)
const remaining = ref(5)
const notice = ref('')

let counter = 0

function nextId() {
  return ++counter
}

/** Stable per-browser id so the quota survives a page reload but not a new browser. */
function sessionId(): string {
  const existing = localStorage.getItem(STORAGE_KEY)
  if (existing) return existing
  const fresh = crypto.randomUUID().replace(/-/g, '')
  localStorage.setItem(STORAGE_KEY, fresh)
  return fresh
}

export function useAssistant() {
  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  function toggle() {
    isOpen.value = !isOpen.value
  }

  function greet(firstName: string) {
    if (messages.value.length) return
    messages.value = [
      {
        id: nextId(),
        role: 'assistant',
        text: `Ask me about ${firstName}'s experience, projects, stack or availability. You have ${remaining.value} questions this session.`,
      },
    ]
  }

  async function ask(input: string) {
    const question = input.trim()
    if (!question || pending.value || remaining.value <= 0) return

    notice.value = ''
    messages.value.push({ id: nextId(), role: 'visitor', text: question })
    pending.value = true

    try {
      const reply = await $fetch<AssistantReply>('/api/assistant', {
        method: 'POST',
        body: { message: question, sessionId: sessionId() },
      })
      remaining.value = reply.remaining
      messages.value.push({ id: nextId(), role: 'assistant', text: reply.answer })
    } catch (error) {
      const data = (error as { data?: { data?: { message?: string; remaining?: number } } }).data?.data
      remaining.value = data?.remaining ?? remaining.value
      notice.value = data?.message ?? 'Something went wrong. Try again in a moment.'
      messages.value.push({
        id: nextId(),
        role: 'assistant',
        text: notice.value,
        failed: true,
      })
    } finally {
      pending.value = false
    }
  }

  return { isOpen, messages, pending, remaining, notice, open, close, toggle, ask, greet }
}
