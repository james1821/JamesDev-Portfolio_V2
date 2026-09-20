<script setup lang="ts">
const props = withDefaults(defineProps<{ name: string; size?: number }>(), { size: 18 })

// Inlined so the site ships no icon package; each path is a 24x24 outline glyph
// unless listed in FILLED.
const PATHS: Record<string, string> = {
  sparkles: 'M9.94 4.5 11 2l1.06 2.5L14.5 5.5l-2.44 1L11 9l-1.06-2.5L7.5 5.5l2.44-1ZM17.5 12.5 18.4 14l1.6.6-1.6.6-.9 1.5-.9-1.5-1.6-.6 1.6-.6.9-1.5ZM7 11l1.6 3.4L12 16l-3.4 1.6L7 21l-1.6-3.4L2 16l3.4-1.6L7 11Z',
  close: 'M6 6l12 12M18 6 6 18',
  send: 'M5 12h14M13 6l6 6-6 6',
  download: 'M12 4v11m0 0-4-4m4 4 4-4M5 19h14',
  mail: 'M3 7.5 10.9 12a2 2 0 0 0 2.2 0L21 7.5M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2Z',
  external: 'M14 4h6m0 0v6m0-6L10 14M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4',
  arrow: 'M5 12h14m-6-6 6 6-6 6',
  plus: 'M12 5v14M5 12h14',
  edit: 'M4 20h4l10-10a2.83 2.83 0 0 0-4-4L4 16v4Z',
  trash: 'M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 12a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-12',
  up: 'M12 19V5m0 0-6 6m6-6 6 6',
  down: 'M12 5v14m0 0 6-6m-6 6-6-6',
  check: 'M5 13l4 4L19 7',
  menu: 'M4 7h16M4 12h16M4 17h16',
  logout: 'M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 16l-4-4 4-4M6 12h10',
  image: 'M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Zm0 10 4.5-4.5a2 2 0 0 1 2.8 0L16 16m-2-3 1.5-1.5a2 2 0 0 1 2.8 0L20 13M9 9.5h.01',
  file: 'M14 3v5a1 1 0 0 0 1 1h5M7 21h10a2 2 0 0 0 2-2V8.8a1 1 0 0 0-.3-.7l-4.8-4.8a1 1 0 0 0-.7-.3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2Z',
  layers: 'M12 3 3 8l9 5 9-5-9-5ZM3 13l9 5 9-5M3 17.5l9 5 9-5',
  briefcase: 'M4 8h16a1 1 0 0 1 1 1v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a1 1 0 0 1 1-1Zm5 0V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2',
  award: 'M12 14a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm-3.5 1.5L7 22l5-2.5L17 22l-1.5-6.5',
  pulse: 'M3 12h4l2.5-7 4 14L16 12h5',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8.4-2.1a1 1 0 0 0 .2-1.1l-1-1.7a1 1 0 0 0-1-.5l-1.4.2a6.5 6.5 0 0 0-1.2-.7l-.3-1.4a1 1 0 0 0-1-.7h-2a1 1 0 0 0-1 .7l-.3 1.4c-.4.2-.8.4-1.2.7l-1.4-.2a1 1 0 0 0-1 .5l-1 1.7a1 1 0 0 0 .2 1.1l1 1a6.5 6.5 0 0 0 0 1.4l-1 1a1 1 0 0 0-.2 1.1l1 1.7a1 1 0 0 0 1 .5l1.4-.2c.4.3.8.5 1.2.7l.3 1.4a1 1 0 0 0 1 .7h2a1 1 0 0 0 1-.7l.3-1.4c.4-.2.8-.4 1.2-.7l1.4.2a1 1 0 0 0 1-.5l1-1.7a1 1 0 0 0-.2-1.1l-1-1a6.5 6.5 0 0 0 0-1.4l1-1Z',
  github: 'M12 2C6.5 2 2 6.5 2 12c0 4.4 2.9 8.2 6.8 9.5.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.2-.4-1.3.1-2.6 0 0 .8-.3 2.7 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.4.1 2.6.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9v2.7c0 .3.2.6.7.5A10 10 0 0 0 22 12c0-5.5-4.5-10-10-10Z',
  linkedin: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6ZM2 9h4v12H2V9Zm2-2a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z',
}

const FILLED = new Set(['sparkles', 'github', 'linkedin'])

const path = computed(() => PATHS[props.name] ?? '')
const filled = computed(() => FILLED.has(props.name))
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    :fill="filled ? 'currentColor' : 'none'"
    :stroke="filled ? 'none' : 'currentColor'"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
    class="shrink-0"
  >
    <path :d="path" />
  </svg>
</template>
