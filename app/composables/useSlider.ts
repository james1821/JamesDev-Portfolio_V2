import { ref, onMounted, onUnmounted } from 'vue'

export function useSlider(getLen: () => number) {
  const track = ref<HTMLElement | null>(null)
  const current = ref(0)

  // ── Navigation (arrows / dots) ────────────────────────────────
  function goTo(i: number) {
    const len = getLen()

    current.value = Math.max(0, Math.min(i, len - 1))

    const children = track.value
      ? (Array.from(track.value.children) as HTMLElement[])
      : []

    const card = children[current.value + 1] ?? children[current.value]

    if (!track.value || !card) return

    track.value.scrollTo({
      left: card.offsetLeft,
      behavior: 'smooth',
    })
  }

  function prev() {
    goTo(current.value - 1)
  }

  function next() {
    goTo(current.value + 1)
  }

  // ── Dot sync on scroll ────────────────────────────────────────
  function onScroll() {
    if (!track.value) return

    const children = Array.from(track.value.children) as HTMLElement[]
    const cards = children.slice(1, children.length - 1)

    const center =
      track.value.scrollLeft + track.value.clientWidth / 2

    let closest = 0
    let minDist = Infinity

    cards.forEach((card, index) => {
      const cardCenter =
        card.offsetLeft + card.offsetWidth / 2

      const dist = Math.abs(cardCenter - center)

      if (dist < minDist) {
        minDist = dist
        closest = index
      }
    })

    current.value = closest
  }

  // ── Drag with momentum (Free Mode) ─────────────────────────────
  let isDragging = false
  let startX = 0
  let startScrollLeft = 0

  let velocity = 0
  let lastPos = 0
  let rafId = 0

  function cancelMomentum() {
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = 0
    }
  }

  function momentumLoop() {
    if (!track.value) return

    track.value.scrollLeft += velocity

    // friction
    velocity *= 0.95

    if (Math.abs(velocity) < 0.2) {
      cancelMomentum()
      return
    }

    rafId = requestAnimationFrame(momentumLoop)
  }

  function onPointerDown(e: PointerEvent) {
    if (!track.value || e.button !== 0) return

    cancelMomentum()

    isDragging = true

    startX = e.clientX
    startScrollLeft = track.value.scrollLeft

    velocity = 0
    lastPos = e.clientX

    track.value.setPointerCapture(e.pointerId)

    track.value.style.cursor = 'grabbing'
    track.value.style.userSelect = 'none'
  }

  function onPointerMove(e: PointerEvent) {
    if (!isDragging || !track.value) return

    const dx = e.clientX - startX

    track.value.scrollLeft = startScrollLeft - dx

    // Smoothed velocity calculation
    const currentVelocity = lastPos - e.clientX
    velocity = velocity * 0.8 + currentVelocity * 0.2

    lastPos = e.clientX
  }

  function onPointerUp() {
    if (!track.value) return

    isDragging = false

    track.value.style.cursor = 'grab'
    track.value.style.userSelect = ''

    rafId = requestAnimationFrame(momentumLoop)
  }

  onMounted(() => {
    const el = track.value
    if (!el) return

    el.style.cursor = 'grab'

    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', onPointerUp)
    el.addEventListener('pointercancel', onPointerUp)
    el.addEventListener('scroll', onScroll, { passive: true })
  })

  onUnmounted(() => {
    cancelMomentum()

    const el = track.value
    if (!el) return

    el.removeEventListener('pointerdown', onPointerDown)
    el.removeEventListener('pointermove', onPointerMove)
    el.removeEventListener('pointerup', onPointerUp)
    el.removeEventListener('pointercancel', onPointerUp)
    el.removeEventListener('scroll', onScroll)
  })

  return {
    track,
    current,
    goTo,
    prev,
    next,
    onScroll,
  }
}