<<<<<<< HEAD
import { useFirebase } from '../lib/firebase'

=======
>>>>>>> b87402ff7d3b4eb2de4ce096e6bfc16a4c5f65e7
/** Read/write helper for the single-document `config/*` records. */
export function useConfigDoc<T extends Record<string, unknown>>(name: string, fallback: T) {
  const data = ref<T>({ ...fallback }) as Ref<T>
  const loading = ref(true)
  const saving = ref(false)
  const message = ref('')
  const error = ref('')

  async function load() {
    try {
      const { db } = useFirebase()
      const { doc, getDoc } = await import('firebase/firestore')
      const snapshot = await getDoc(doc(db, 'config', name))
      if (snapshot.exists()) data.value = { ...fallback, ...(snapshot.data() as T) }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Could not load settings.'
    } finally {
      loading.value = false
    }
  }

  async function save() {
    saving.value = true
    message.value = ''
    error.value = ''
    try {
      const { db } = useFirebase()
      const { doc, setDoc, serverTimestamp } = await import('firebase/firestore')
      await setDoc(doc(db, 'config', name), { ...data.value, updatedAt: serverTimestamp() }, { merge: true })
      message.value = 'Saved. The public site picks this up within five minutes.'
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Could not save settings.'
    } finally {
      saving.value = false
    }
  }

  onMounted(load)

  return { data, loading, saving, message, error, save }
}
