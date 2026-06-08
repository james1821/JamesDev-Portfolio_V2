export function useHorizontalSlider() {
  const track = ref<HTMLElement | null>(null)
  const current = ref(0)
  let isScrolling = false

  function goTo(i: number) {
    current.value = i
    const card = track.value?.children[i] as HTMLElement
    card?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }

  function prev() { if (current.value > 0) goTo(current.value - 1) }
  function next(len: number) { if (current.value < len - 1) goTo(current.value + 1) }

  function onScroll() {
    if (!track.value) return
    const cards = Array.from(track.value.children) as HTMLElement[]
    const center = track.value.scrollLeft + track.value.clientWidth / 2
    let closest = 0; let minDist = Infinity
    cards.forEach((c, i) => {
      const dist = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center)
      if (dist < minDist) { minDist = dist; closest = i }
    })
    current.value = closest
  }

  // Mouse wheel → horizontal scroll
  function onWheel(e: WheelEvent) {
    if (!track.value) return
    // Only hijack purely-vertical wheel events on the track
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
    e.preventDefault()
    track.value.scrollLeft += e.deltaY
  }

  onMounted(() => {
    const el = track.value
    if (!el) return
    el.addEventListener('wheel', onWheel, { passive: false })
  })

  onUnmounted(() => {
    track.value?.removeEventListener('wheel', onWheel)
  })

  return { track, current, goTo, prev, next, onScroll }
}
