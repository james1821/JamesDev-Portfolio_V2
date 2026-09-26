import type { User } from 'firebase/auth'
<<<<<<< HEAD
import { useFirebase } from '../lib/firebase'

const user = ref<User | null>(null)
=======

interface AdminClaim {
  uid: string
  email: string
  displayName: string
  claimedAt: unknown
}

const user = ref<User | null>(null)
const isAdmin = ref(false)
>>>>>>> b87402ff7d3b4eb2de4ce096e6bfc16a4c5f65e7
const ready = ref(false)
const authError = ref('')

let watching = false

<<<<<<< HEAD
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
=======
export function useAuth() {
  /**
   * Admin ownership lives in a single `config/admin` document. Security rules
   * allow creating it only when it does not already exist, so the first
   * account to sign in claims the site and no later account can take it over.
   */
  async function resolveAdmin(current: User | null) {
    if (!current) {
      isAdmin.value = false
      return
    }

    const { db } = useFirebase()
    const { doc, getDoc, setDoc, serverTimestamp } = await import('firebase/firestore')
    const ref = doc(db, 'config', 'admin')
    const snapshot = await getDoc(ref)

    if (!snapshot.exists()) {
      const claim: AdminClaim = {
        uid: current.uid,
        email: current.email ?? '',
        displayName: current.displayName ?? '',
        claimedAt: serverTimestamp(),
      }
      try {
        await setDoc(ref, claim)
        isAdmin.value = true
      } catch {
        // Lost the race to another sign-in; re-read to get the real owner.
        const retry = await getDoc(ref)
        isAdmin.value = retry.data()?.uid === current.uid
      }
      return
    }

    isAdmin.value = snapshot.data()?.uid === current.uid
  }

>>>>>>> b87402ff7d3b4eb2de4ce096e6bfc16a4c5f65e7
  function watch() {
    if (watching || !import.meta.client) return
    watching = true

<<<<<<< HEAD
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
=======
    const { auth } = useFirebase()
    import('firebase/auth').then(({ onAuthStateChanged }) => {
      onAuthStateChanged(auth, async (current) => {
        user.value = current
        try {
          await resolveAdmin(current)
        } catch (error) {
          authError.value = error instanceof Error ? error.message : 'Could not verify admin access.'
        } finally {
          ready.value = true
        }
      })
    })
>>>>>>> b87402ff7d3b4eb2de4ce096e6bfc16a4c5f65e7
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
<<<<<<< HEAD
=======
    isAdmin.value = false
>>>>>>> b87402ff7d3b4eb2de4ce096e6bfc16a4c5f65e7
  }

  return { user, isAdmin, ready, authError, watch, signIn, signOut: signOutUser }
}
