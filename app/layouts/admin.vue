<script setup lang="ts">
import { useAuth } from '../composables/useAuth'
import { isFirebaseConfigured } from '../lib/firebase'

const { user, isAdmin, ready, authError, watch: watchAuth, signIn, signOut } = useAuth()

const configured = isFirebaseConfigured()
if (configured) watchAuth()

const adminEmail = useRuntimeConfig().public.adminEmail as string

const caughtError = ref<Error | null>(null)

function onBoundaryError(error: unknown) {
  caughtError.value = error as Error
  console.error('[admin] section error', error)
}

const links = [
  { to: '/admin', label: 'Overview', icon: 'pulse' },
  { to: '/admin/current', label: 'Currently working on', icon: 'pulse' },
  { to: '/admin/projects', label: 'Projects', icon: 'layers' },
  { to: '/admin/experience', label: 'Experience', icon: 'briefcase' },
  { to: '/admin/skills', label: 'Skills', icon: 'layers' },
  { to: '/admin/certifications', label: 'Certifications', icon: 'award' },
  { to: '/admin/settings', label: 'Profile & resume', icon: 'settings' },
]

useHead({ title: 'Dashboard' })
</script>

<template>
  <div class="min-h-screen bg-ink">
    <div v-if="!configured" class="grid min-h-screen place-items-center px-6">
      <div class="surface max-w-md p-8 text-center">
        <h1 class="text-lg font-semibold text-content-strong">Firebase is not configured</h1>
        <p class="lede mt-3 text-sm">
          Set the <code class="chip">NUXT_PUBLIC_FIREBASE_*</code> variables and restart the server.
          The public site still works without them — it falls back to the bundled content.
        </p>
      </div>
    </div>

    <div v-else-if="!adminEmail" class="grid min-h-screen place-items-center px-6">
      <div class="surface max-w-md p-8 text-center">
        <h1 class="text-lg font-semibold text-content-strong">No admin account is set</h1>
        <p class="lede mt-3 text-sm">
          Set <code class="chip">NUXT_PUBLIC_ADMIN_EMAIL</code> to your Google account's email, and make sure it
          matches the email hardcoded in <code class="chip">firestore.rules</code> and
          <code class="chip">storage.rules</code>. Republish both rule files, then restart the server.
        </p>
      </div>
    </div>

    <div v-else-if="!ready" class="grid min-h-screen place-items-center">
      <div class="flex items-center gap-2 text-sm text-content-muted">
        <span class="h-2 w-2 animate-breathe rounded-full bg-accent" />
        Checking access…
      </div>
    </div>

    <SignIn
      v-else-if="!user || !isAdmin"
      :signed-in="Boolean(user)"
      :email="user?.email ?? ''"
      :error="authError"
      @sign-in="signIn"
      @sign-out="signOut"
    />

    <div v-else class="flex min-h-screen flex-col lg:flex-row">
      <aside class="border-b border-line bg-surface lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div class="flex items-center justify-between gap-3 p-5">
          <NuxtLink to="/" class="text-sm font-medium text-content-strong">← Back to site</NuxtLink>
          <button type="button" class="btn-ghost btn-sm" @click="signOut">
            <AppIcon name="logout" :size="15" />
            <span class="sr-only">Sign out</span>
          </button>
        </div>

        <nav aria-label="Dashboard" class="grid gap-1 px-3 pb-5">
          <NuxtLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-content transition
                   hover:bg-raised hover:text-content-strong"
            active-class="bg-raised text-content-strong"
            :exact="link.to === '/admin'"
          >
            <AppIcon :name="link.icon" :size="16" />
            {{ link.label }}
          </NuxtLink>
        </nav>
      </aside>

      <main class="flex-1 p-5 sm:p-8">
        <div class="mx-auto max-w-4xl">
          <NuxtErrorBoundary @error="onBoundaryError">
            <slot />
            <template #error="{ error, clearError }">
              <div class="surface space-y-3 border-danger/30 p-6">
                <p class="text-sm font-medium text-danger">This section hit an error</p>
                <p class="whitespace-pre-wrap font-mono text-2xs text-content">{{ error.message }}</p>
                <details open>
                  <summary class="cursor-pointer text-2xs text-content-muted">Technical details — copy this when reporting the problem</summary>
                  <pre class="mt-2 max-h-72 overflow-auto whitespace-pre-wrap break-all font-mono text-2xs text-content-muted">{{ error.stack }}</pre>
                </details>
                <button type="button" class="btn-secondary btn-sm" @click="clearError">Try again</button>
              </div>
            </template>
          </NuxtErrorBoundary>
        </div>
      </main>
    </div>
  </div>
</template>