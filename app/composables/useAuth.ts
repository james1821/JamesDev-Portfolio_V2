import type { User } from 'firebase/auth'
import { useFirebase } from '../lib/firebase'

const user = ref<User | null>(null)
const ready = ref(false)
const authError = ref('')

let watching = false

function isPermissionDenied(error: unknown): boolean {
  return (error as { code?: string })?.code === 'permission-denied'
}

/**
 * The dashboard has exactly one authorised account, matched by email — set in
 * NUXT_PUBLIC_ADMIN_EMAIL and mirrored in firestore.rules and storage.rules.
 * There is no claim-on-first-sign-in step and nothing to race: anyone else
 * who signs in is turned away immediately, with no write ever attempted.
 *
 * This check is for UX only. The real enforcement is server-side — Firestore
 * and Storage reject writes from any other account regardless of what this
 * function decides, so a compromised or modified client can't grant itself
 * access.
 */
const isAdmin = computed(() => {
  const adminEmail = useRuntimeConfig().public.adminEmail as string
  return Boolean(adminEmail && user.value?.email?.toLowerCase() === adminEmail.toLowerCase())
})

export function useAuth() {
  function watch() {
    if (watching || !import.meta.client) return
    watching = true

    try {
      const { auth } = useFirebase()
      import('firebase/auth').then(({ onAuthStateChanged }) => {
        onAuthStateChanged(
          auth,
          (current) => {
            user.value = current
            ready.value = true
          },
          (error) => {
            authError.value = isPermissionDenied(error)
              ? 'Firebase Authentication rejected this request. Check that Google sign-in is enabled for this project.'
              : error.message
            ready.value = true
          },
        )
      })
    } catch (error) {
      // A misconfigured project (bad key, wrong bucket format, etc.) should
      // show a message on this page, not crash the whole app to the 500 screen.
      authError.value = error instanceof Error ? error.message : 'Could not reach Firebase.'
      ready.value = true
    }
  }

  async function signIn() {
    authError.value = ''
    const { auth } = useFirebase()
    const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth')

    try {
      await signInWithPopup(auth, new GoogleAuthProvider())
    } catch (error) {
      const code = (error as { code?: string }).code ?? ''
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return
      authError.value = 'Sign-in failed. Check that this domain is authorised in Firebase Authentication.'
    }
  }

  async function signOutUser() {
    const { auth } = useFirebase()
    const { signOut } = await import('firebase/auth')
    await signOut(auth)
  }

  return { user, isAdmin, ready, authError, watch, signIn, signOut: signOutUser }
}
