import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

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
    })
  )

  const basePublicUrl = publicUrl.endsWith('/') ? publicUrl.slice(0, -1) : publicUrl
  return `${basePublicUrl}/${cleanKey}`
}
