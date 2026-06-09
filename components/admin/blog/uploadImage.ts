/**
 * Image upload seam for the blog editor.
 *
 * Uses XMLHttpRequest instead of fetch so we can report real upload progress
 * (fetch doesn't expose upload progress events). The `/api/blog-upload` route
 * handler writes the file to /public/uploads and returns a served URL.
 *
 * R2 swap later: change ONLY the fetch target / write step in the route handler
 * (app/api/blog-upload/route.ts). This client function and every caller stay the
 * same. Quality is preserved: the route handler stores bytes verbatim, and any
 * resizing/cropping happens client-side in the cropper before upload.
 */

export interface UploadResult {
  url: string
}

/**
 * Upload an image file/blob and return its served URL.
 *
 * @param onProgress  Optional callback fired with a 0–100 percentage as bytes
 *                    are sent to the server. Only fires during the upload phase;
 *                    server processing time is NOT included.
 */
export async function uploadImage(
  file: Blob,
  filename = 'image',
  onProgress?: (percent: number) => void
): Promise<UploadResult> {
  const form = new FormData()
  // Preserve a sensible filename + extension for the server's type check.
  const named =
    file instanceof File ? file : new File([file], `${filename}`, { type: file.type })
  form.append('file', named)

  return new Promise<UploadResult>((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    // Track upload progress
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const percent = Math.round((e.loaded / e.total) * 100)
        onProgress(percent)
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText))
        } catch {
          reject(new Error('Invalid response from server.'))
        }
      } else {
        try {
          const data = JSON.parse(xhr.responseText)
          reject(new Error(data.error || 'Upload failed.'))
        } catch {
          reject(new Error('Upload failed.'))
        }
      }
    })

    xhr.addEventListener('error', () => reject(new Error('Network error during upload.')))
    xhr.addEventListener('abort', () => reject(new Error('Upload cancelled.')))

    xhr.open('POST', '/api/blog-upload')
    xhr.send(form)
  })
}
