import { ref } from 'vue'

// Module-scope refs => shared across every component that calls
// useAIAssistant(), so the Hero "Ask AI" button and the floating
// widget always stay in sync.
const isOpen = ref(false)

export function useAIAssistant() {
  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  function toggle() {
    isOpen.value = !isOpen.value
  }

  return { isOpen, open, close, toggle }
}
