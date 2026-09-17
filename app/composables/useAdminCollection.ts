import type { CollectionName } from '#shared/types'

interface Orderable {
  id: string
  order?: number
}

/**
 * One CRUD surface for every content collection. Each admin screen supplies the
 * collection name and its own form; ordering, live updates and error handling
 * are shared here.
 */
export function useAdminCollection<T extends Orderable>(name: CollectionName) {
  const items = ref<T[]>([]) as Ref<T[]>
  const loading = ref(true)
  const error = ref('')

  let unsubscribe: (() => void) | null = null

  async function subscribe() {
    const { db } = useFirebase()
    const { collection, onSnapshot, query, orderBy } = await import('firebase/firestore')

    unsubscribe = onSnapshot(
      query(collection(db, name), orderBy('order', 'asc')),
      (snapshot) => {
        items.value = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as T)
        loading.value = false
        error.value = ''
      },
      (err) => {
        loading.value = false
        error.value = err.message
      },
    )
  }

  function nextOrder(): number {
    return items.value.reduce((max, item) => Math.max(max, item.order ?? 0), 0) + 1
  }

  async function create(payload: Omit<T, 'id'>) {
    const { db } = useFirebase()
    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
    await addDoc(collection(db, name), { ...payload, createdAt: serverTimestamp() })
  }

  async function update(id: string, payload: Partial<T>) {
    const { db } = useFirebase()
    const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore')
    await updateDoc(doc(db, name, id), { ...payload, updatedAt: serverTimestamp() })
  }

  async function remove(id: string) {
    const { db } = useFirebase()
    const { doc, deleteDoc } = await import('firebase/firestore')
    await deleteDoc(doc(db, name, id))
  }

  /** Swaps the `order` value with the neighbour so the list reorders by one step. */
  async function move(id: string, direction: -1 | 1) {
    const index = items.value.findIndex((i) => i.id === id)
    const target = items.value[index + direction]
    const current = items.value[index]
    if (!target || !current) return

    const { db } = useFirebase()
    const { doc, writeBatch } = await import('firebase/firestore')
    const batch = writeBatch(db)
    batch.update(doc(db, name, current.id), { order: target.order ?? 0 })
    batch.update(doc(db, name, target.id), { order: current.order ?? 0 })
    await batch.commit()
  }

  onMounted(subscribe)
  onUnmounted(() => unsubscribe?.())

  return { items, loading, error, create, update, remove, move, nextOrder }
}
