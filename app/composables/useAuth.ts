import type { User } from 'firebase/auth'
import { useFirebase } from '../lib/firebase'

interface AdminClaim {
  uid: string
  email: string
  displayName: string
  claimedAt: unknown
}

const user = ref<User | null>(null)
const isAdmin = ref(false)
const ready = ref(false)
const authError = ref('')

let watching = false

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

  function watch() {
    if (watching || !import.meta.client) return
    watching = true

    try {
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
    isAdmin.value = false
  }

  return { user, isAdmin, ready, authError, watch, signIn, signOut: signOutUser }
}
