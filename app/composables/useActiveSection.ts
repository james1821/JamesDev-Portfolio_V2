import { ref, onMounted, onUnmounted } from 'vue'

export function useActiveSection(sectionIds: string[]) {
  const activeSection = ref<string>(sectionIds[0] || '')

  let observer: IntersectionObserver | null = null

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeSection.value = entry.target.id
          }
        })
      },
      {
        rootMargin: '-40% 0px -55% 0px',
        threshold: 0,
      }
    )

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer?.observe(el)
    })
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return { activeSection }
}
