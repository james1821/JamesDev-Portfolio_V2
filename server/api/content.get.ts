import type { Firestore } from 'firebase-admin/firestore'
import type { PortfolioContent } from '#shared/types'
import { seedContent } from '../utils/seedContent'
import { useFirestore } from '../utils/firebaseAdmin'

const COLLECTIONS = ['skills', 'experience', 'projects', 'currentWork', 'certifications'] as const

async function readCollection<T>(db: Firestore, name: string): Promise<T[]> {
  const snapshot = await db.collection(name).get()
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }) as T & { order?: number })
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) as T[]
}

export default defineCachedEventHandler(
  async (): Promise<PortfolioContent> => {
    const db = useFirestore()
    if (!db) return seedContent

    try {
      const [personalDoc, ...collections] = await Promise.all([
        db.doc('config/site').get(),
        ...COLLECTIONS.map((name) => readCollection(db, name)),
      ])

      const [skills, experience, projects, currentWork, certifications] = collections as [
        PortfolioContent['skills'],
        PortfolioContent['experience'],
        PortfolioContent['projects'],
        PortfolioContent['currentWork'],
        PortfolioContent['certifications'],
      ]

      return {
        personal: personalDoc.exists
          ? { ...seedContent.personal, ...(personalDoc.data() as PortfolioContent['personal']) }
          : seedContent.personal,
        // Fall back per-collection so a half-populated database still renders.
        skills: skills.length ? skills : seedContent.skills,
        experience: experience.length ? experience : seedContent.experience,
        projects: projects.length ? projects : seedContent.projects,
        currentWork,
        certifications: certifications.length ? certifications : seedContent.certifications,
      }
    } catch {
      return seedContent
    }
  },
  { maxAge: 300, swr: true, name: 'portfolio-content' },
)
