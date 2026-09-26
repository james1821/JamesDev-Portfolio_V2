<<<<<<< HEAD
import { useFirebase } from '../lib/firebase'

=======
>>>>>>> b87402ff7d3b4eb2de4ce096e6bfc16a4c5f65e7
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const MAX_RESUME_BYTES = 10 * 1024 * 1024

function slugify(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48)
}

export function useUpload() {
  const progress = ref(0)
  const uploading = ref(false)
  const error = ref('')

  async function put(file: File, folder: string): Promise<string> {
    const { storage } = useFirebase()
    const { ref: storageRef, uploadBytesResumable, getDownloadURL } = await import('firebase/storage')

    const extension = file.name.split('.').pop()?.toLowerCase() ?? 'bin'
    const path = `${folder}/${Date.now()}-${slugify(file.name)}.${extension}`
    const task = uploadBytesResumable(storageRef(storage, path), file, {
      contentType: file.type,
      cacheControl: 'public, max-age=31536000, immutable',
    })

    uploading.value = true
    progress.value = 0

    return new Promise((resolve, reject) => {
      task.on(
        'state_changed',
        (snapshot) => {
          progress.value = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        },
        (err) => {
          uploading.value = false
          error.value = err.message
          reject(err)
        },
        async () => {
          uploading.value = false
          progress.value = 100
          resolve(await getDownloadURL(task.snapshot.ref))
        },
      )
    })
  }

  async function uploadImage(file: File): Promise<string> {
    error.value = ''
    if (!IMAGE_TYPES.includes(file.type)) {
      error.value = 'Use a JPG, PNG, WebP or GIF file.'
      throw new Error(error.value)
    }
    if (file.size > MAX_IMAGE_BYTES) {
      error.value = 'Images must be under 5 MB.'
      throw new Error(error.value)
    }
    return put(file, 'images')
  }

  async function uploadResume(file: File): Promise<string> {
    error.value = ''
    if (file.type !== 'application/pdf') {
      error.value = 'The resume must be a PDF.'
      throw new Error(error.value)
    }
    if (file.size > MAX_RESUME_BYTES) {
      error.value = 'The resume must be under 10 MB.'
      throw new Error(error.value)
    }
    return put(file, 'resume')
  }

  return { progress, uploading, error, uploadImage, uploadResume }
}
