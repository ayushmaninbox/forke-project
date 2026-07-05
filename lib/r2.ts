import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import * as fs from 'fs'
import * as path from 'path'

/**
 * Checks if the Cloudflare R2 environment variables are fully configured.
 * If any of these are missing, the application falls back to local disk storage
 * under the public directory.
 */
export function isR2Configured(): boolean {
  return !!(
    process.env.CLOUDFLARE_R2_ACCESS_KEY_ID &&
    process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY &&
    process.env.CLOUDFLARE_R2_ENDPOINT &&
    process.env.CLOUDFLARE_R2_BUCKET_NAME &&
    process.env.CLOUDFLARE_R2_PUBLIC_URL
  )
}

/**
 * Uploads a file buffer directly to Cloudflare R2 bucket.
 * 
 * @param fileBuffer The buffer content of the file.
 * @param key The destination path/key in the bucket (e.g., 'blogs/my-image.jpg').
 * @param contentType The MIME type of the file.
 * @returns The fully qualified public URL to access the uploaded file.
 */
export async function uploadToR2(
  fileBuffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
  const endpoint = process.env.CLOUDFLARE_R2_ENDPOINT
  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME
  const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL

  if (!accessKeyId || !secretAccessKey || !endpoint || !bucketName || !publicUrl) {
    throw new Error('Cloudflare R2 is not fully configured. Missing environment variables.')
  }

  const s3Client = new S3Client({
    region: 'auto',
    endpoint: endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })

  // Sanitize the key but allow forward slashes for folders
  const cleanKey = key.replace(/[^a-zA-Z0-9.-_/]/g, '_')

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: cleanKey,
      Body: fileBuffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    })
  )

  const basePublicUrl = publicUrl.endsWith('/') ? publicUrl.slice(0, -1) : publicUrl
  return `${basePublicUrl}/${cleanKey}`
}

/**
 * Generate a short-lived presigned PUT URL so the browser can upload a file
 * DIRECTLY to R2, bypassing the server entirely. This sidesteps Vercel's
 * ~4.5 MB serverless request-body limit (which a multi-MB GIF blows past).
 *
 * The signed URL is bound to the exact key and Content-Type, so the client
 * must PUT with the same `Content-Type` header it declared here.
 *
 * @param key         Destination key in the bucket (e.g. 'blogs/uuid.gif').
 * @param contentType MIME type the browser will send (must match on PUT).
 * @param expiresIn   URL lifetime in seconds (default 5 minutes).
 * @returns `{ uploadUrl, publicUrl }` — PUT to `uploadUrl`, serve `publicUrl`.
 */
export async function presignUpload(
  key: string,
  contentType: string,
  expiresIn = 300
): Promise<{ uploadUrl: string; publicUrl: string }> {
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
  const endpoint = process.env.CLOUDFLARE_R2_ENDPOINT
  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME
  const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL

  if (!accessKeyId || !secretAccessKey || !endpoint || !bucketName || !publicUrl) {
    throw new Error('Cloudflare R2 is not fully configured. Missing environment variables.')
  }

  const s3Client = new S3Client({
    region: 'auto',
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  })

  // Same sanitization as uploadToR2 so keys stay consistent across both paths.
  const cleanKey = key.replace(/[^a-zA-Z0-9.-_/]/g, '_')

  const uploadUrl = await getSignedUrl(
    s3Client,
    new PutObjectCommand({
      Bucket: bucketName,
      Key: cleanKey,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    }),
    { expiresIn }
  )

  const basePublicUrl = publicUrl.endsWith('/') ? publicUrl.slice(0, -1) : publicUrl
  return { uploadUrl, publicUrl: `${basePublicUrl}/${cleanKey}` }
}

/**
 * Deletes a file, either from Cloudflare R2 if it is an R2 URL,
 * or from the local public directory.
 * 
 * @param url The fully qualified URL or relative local path of the file.
 */
export async function deleteFileByUrl(url: string): Promise<boolean> {
  if (!url) return false

  // 1. Check if it's an R2 URL
  const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL || ''
  const isR2Url = isR2Configured() && (
    url.startsWith(publicUrl) || 
    url.includes('.r2.dev/') || 
    url.includes('.r2.cloudflarestorage.com/')
  )

  if (isR2Url) {
    try {
      const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID
      const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
      const endpoint = process.env.CLOUDFLARE_R2_ENDPOINT
      const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME

      if (!accessKeyId || !secretAccessKey || !endpoint || !bucketName) {
        throw new Error('R2 credentials not fully configured.')
      }

      // Extract key from the URL. The key is the path after the hostname/public URL
      // e.g. https://pub-xxxx.r2.dev/blogs/file.png -> blogs/file.png
      let key = ''
      if (publicUrl && url.startsWith(publicUrl)) {
        key = url.slice(publicUrl.length)
      } else {
        // Fallback generic parser: get path part from URL
        const parsedUrl = new URL(url)
        key = parsedUrl.pathname
      }
      
      // Strip leading slash if any
      if (key.startsWith('/')) {
        key = key.slice(1)
      }

      const s3Client = new S3Client({
        region: 'auto',
        endpoint: endpoint,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      })

      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: bucketName,
          Key: key,
        })
      )
      return true
    } catch (e: any) {
      console.error('Failed to delete file from R2:', e.message || e)
      return false
    }
  }

  // 2. Otherwise delete from local filesystem
  try {
    // Local URL is e.g. /uploads/blogs/filename.png or /avatars/filename.png
    // Strip leading slash to resolve from process.cwd() + "/public"
    const cleanPath = url.startsWith('/') ? url.slice(1) : url
    const localPath = path.resolve(process.cwd(), 'public', cleanPath)
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath)
      return true
    }
  } catch (e: any) {
    console.error('Failed to delete local file:', e.message || e)
  }

  return false
}

/**
 * Generate a short-lived presigned GET URL so that the user can download
 * the backup file securely.
 */
export async function getPresignedDownloadUrl(
  key: string,
  expiresIn = 43200 // 12 hours in seconds
): Promise<string> {
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
  const endpoint = process.env.CLOUDFLARE_R2_ENDPOINT
  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME

  if (!accessKeyId || !secretAccessKey || !endpoint || !bucketName) {
    throw new Error('Cloudflare R2 is not fully configured.')
  }

  const s3Client = new S3Client({
    region: 'auto',
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  })

  const cleanKey = key.replace(/[^a-zA-Z0-9.-_/]/g, '_')

  return await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: bucketName,
      Key: cleanKey,
    }),
    { expiresIn }
  )
}

/**
 * Lists all objects with prefix 'backups/' and deletes any that are
 * older than maxAgeMs (default 12 hours).
 */
export async function cleanupExpiredBackups(
  maxAgeMs = 12 * 60 * 60 * 1000 // 12 hours
): Promise<string[]> {
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
  const endpoint = process.env.CLOUDFLARE_R2_ENDPOINT
  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME

  if (!accessKeyId || !secretAccessKey || !endpoint || !bucketName) {
    throw new Error('Cloudflare R2 is not fully configured.')
  }

  const s3Client = new S3Client({
    region: 'auto',
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  })

  const listRes = await s3Client.send(
    new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: 'backups/',
    })
  )

  if (!listRes.Contents || listRes.Contents.length === 0) {
    return []
  }

  const now = Date.now()
  const deletedKeys: string[] = []
  
  const objectsToDelete = listRes.Contents.filter((obj) => {
    if (!obj.Key || !obj.LastModified) return false
    const age = now - new Date(obj.LastModified).getTime()
    return age > maxAgeMs
  })

  if (objectsToDelete.length > 0) {
    await s3Client.send(
      new DeleteObjectsCommand({
        Bucket: bucketName,
        Delete: {
          Objects: objectsToDelete.map((obj) => ({ Key: obj.Key! })),
        },
      })
    )
    objectsToDelete.forEach((obj) => {
      if (obj.Key) deletedKeys.push(obj.Key)
    })
  }

  return deletedKeys
}
