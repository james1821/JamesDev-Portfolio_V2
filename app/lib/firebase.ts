import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

interface FirebaseServices {
  app: FirebaseApp
  auth: Auth
  db: Firestore
  storage: FirebaseStorage
}

let services: FirebaseServices | null = null

/**
 * Imported only by admin-route code, so Vite keeps the whole Firebase web SDK
 * in a separate chunk that public visitors never download.
 */
export function useFirebase(): FirebaseServices {
  if (services) return services

  const { firebase } = useRuntimeConfig().public

  if (!firebase.apiKey || !firebase.projectId) {
    throw new Error('Firebase is not configured. Set the NUXT_PUBLIC_FIREBASE_* environment variables.')
  }

  const app = getApps()[0] ?? initializeApp({ ...firebase })

  services = {
    app,
    auth: getAuth(app),
    db: getFirestore(app),
    storage: getStorage(app),
  }

  return services
}

export function isFirebaseConfigured(): boolean {
  const { firebase } = useRuntimeConfig().public
  return Boolean(firebase.apiKey && firebase.projectId)
}
