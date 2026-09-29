import { cert, getApps, initializeApp, type App } from 'firebase-admin/app'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'

let cached: Firestore | null = null

/**
 * Returns a Firestore instance, or null when service-account credentials are
 * absent. Returning null (rather than throwing) lets the content API fall back
 * to the bundled seed data so the site still builds on a fresh clone.
 */
export function useFirestore(): Firestore | null {
  if (cached) return cached

  const config = useRuntimeConfig()
  const projectId = config.firebaseProjectId
  const clientEmail = config.firebaseClientEmail
  // Vercel and most dashboards store the PEM with escaped newlines.
  const privateKey = config.firebasePrivateKey?.replace(/\\n/g, '\n')

  if (!projectId || !clientEmail || !privateKey) return null

  const app: App = getApps()[0] ?? initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    projectId,
  })

  cached = getFirestore(app)
  cached.settings({ ignoreUndefinedProperties: true })
  return cached
}
