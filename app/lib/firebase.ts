import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, initializeFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

interface FirebaseServices {
  app: FirebaseApp
  auth: Auth
  db: Firestore
  storage: FirebaseStorage
}

let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null
let storage: FirebaseStorage | null = null

function getApp(): FirebaseApp {
  if (app) return app

  const { firebase } = useRuntimeConfig().public
  if (!firebase.apiKey || !firebase.projectId) {
    throw new Error('Firebase is not configured. Set the NUXT_PUBLIC_FIREBASE_* environment variables.')
  }

  app = getApps()[0] ?? initializeApp({ ...firebase })
  return app
}

/**
 * Imported only by admin-route code, so Vite keeps the whole Firebase web SDK
 * in a separate chunk that public visitors never download.
 *
 * Each service is a getter evaluated only when the caller actually reads it
 * (`const { auth } = useFirebase()` never touches `storage`). getStorage()
 * throws synchronously if the storage bucket is missing or malformed, so
 * eagerly building all three here would break sign-in for anyone who hasn't
 * finished configuring Storage yet.
 */
export function useFirebase(): FirebaseServices {
  return {
    get app() {
      return getApp()
    },
    get auth() {
      return (auth ??= getAuth(getApp()))
    },
    get db() {
      if (!db) {
        try {
          // Falls back to HTTP long-polling when the streaming connection is
          // blocked or mangled by an extension, proxy, VPN or antivirus.
          db = initializeFirestore(getApp(), { experimentalAutoDetectLongPolling: true })
        } catch {
          // Already initialised (e.g. after a hot reload) — reuse that instance.
          db = getFirestore(getApp())
        }
      }
      return db
    },
    get storage() {
      return (storage ??= getStorage(getApp()))
    },
  }
}

export function isFirebaseConfigured(): boolean {
  const { firebase } = useRuntimeConfig().public
  return Boolean(firebase.apiKey && firebase.projectId)
}
  