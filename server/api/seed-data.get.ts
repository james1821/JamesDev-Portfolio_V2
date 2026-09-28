import { seedContent } from '../utils/seedContent'

// Exposes the bootstrap dataset so the dashboard can write it into Firestore
// without duplicating the content in the client bundle.
export default defineEventHandler(() => seedContent)
