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

function isPermissionDenied(error: unknown): boolean {
  return (error as { code?: string })?.code === 'permission-denied'
}

/**
 * "Missing or insufficient permissions" is Firestore's own message whenever a
 * security rule evaluation returns false — it fires just as reliably for a
 * genuinely-first sign-in as for a later one if firestore.rules was never
 * published. That's the far more common cause in practice, so lead with it.
 */
function translateFirestoreError(error: unknown): Error {
  if (isPermissionDenied(error)) {
    return new Error(
      'Firestore is rejecting this request, which almost always means the security rules in firestore.rules ' +
        'were never published. In the Firebase console, open Firestore Database → Rules, paste in the contents ' +
        'of firestore.rules, and click Publish — then reload this page.',
    )
  }
  return error instanceof Error ? error : new Error('Could not verify admin access.')
}

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

    let snapshot
    try {
      snapshot = await getDoc(ref)
    } catch (error) {
      throw translateFirestoreError(error)
    }

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
      } catch (error) {
        if (isPermissionDenied(error)) throw translateFirestoreError(error)
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
